const crypto = require( 'crypto' );
const moment = require( "moment" );
const web3Abi = require( "web3-eth-abi" );
const web3Utils = require( "web3-utils" );
const ethUtil = require( "ethereumjs-util" );
const { ethers } = require("hardhat");
const fs = require("fs");

const VERIFIABLE_CREDENTIAL_TYPEHASH = web3Utils.soliditySha3( "VerifiableCredential(address issuer,address subject,bytes32 data,uint256 validFrom,uint256 validTo)" );

const EIP712DOMAIN_TYPEHASH = web3Utils.soliditySha3( "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)" );

// Adress of credential registry
const REGISTRY_ADRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

// Adress of claims verifier
const VERIFYER_ADRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

const sleep = seconds => new Promise( resolve => setTimeout( resolve, seconds ) );

function sha256( data ) {
	const hashFn = crypto.createHash( 'sha256' );
	hashFn.update( data );
	return hashFn.digest( 'hex' );
}

//Generates a hash based on the VC, issuer and adress of the claims verifier
function getCredentialHash( vc, issuer, claimsVerifierContractAddress ) {

	const hashDiplomaHex = `0x${sha256( JSON.stringify( vc.credentialSubject ) )}`;
	
	const encodeEIP712Domain = web3Abi.encodeParameters(
		['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'], 
		[EIP712DOMAIN_TYPEHASH, web3Utils.sha3( "EIP712Domain" ), web3Utils.sha3( "1" ), 648529, claimsVerifierContractAddress] 
	);

	const hashEIP712Domain = web3Utils.soliditySha3( encodeEIP712Domain );
	
	const validFrom = new Date( vc.issuanceDate ).getTime();

	const validTo = new Date( vc.expirationDate ).getTime();

	const subjectAddress = vc.credentialSubject.id.split( ':' ).slice( -1 )[0];

	
	const encodeHashCredential = web3Abi.encodeParameters(
		['bytes32', 'address', 'address', 'bytes32', 'uint256', 'uint256'], 
		[VERIFIABLE_CREDENTIAL_TYPEHASH, issuer.address, subjectAddress, hashDiplomaHex, Math.round( validFrom / 1000 ), Math.round( validTo / 1000 )] 
	);

	/* Calculates the SHA-256 hash of the encodeEIP712Domain variable. */
	const hashCredential = web3Utils.soliditySha3( encodeHashCredential );

	/* Encodes the parameters hashEIP712Domain (assures different signature) and the hexidecimal string representation of the hash of the VC */
	const encodedCredentialHash = web3Abi.encodeParameters( 
		['bytes32', 'bytes32'], 
		 [hashEIP712Domain, hashCredential.toString( 16 )] ); 

	return web3Utils.soliditySha3( '0x1901'.toString( 16 ) + encodedCredentialHash.substring( 2, 131 ) ); 
}

/* Takes the credentialHash and the issuer's private key as inputs, signs the hash using the private key, and returns the resulting signature in the RPC-style format. */
function signCredential( credentialHash, issuer ) {
	const rsv = ethUtil.ecsign(
		Buffer.from( credentialHash.substring( 2, 67 ), 'hex' ), 
		Buffer.from( issuer.privateKey, 'hex' ) 
	);
	return ethUtil.toRpcSig( rsv.v, rsv.r, rsv.s ); // returns an object rsv containing three properties: r, s, and v. These values represent the signature components used in Ethereum.
}

//TODO
//Expand so it takes all nescecary subject data
async function registerCredential(subject, registry) {

    //TODO
    //Make issuer and signers dynamic
	const issuer = {
		address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 
		privateKey: 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
	};

	const signers = [{
		address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0", 
		privateKey: 'de9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0'
	}, {
		address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", 
		privateKey: 'df57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'
	}]

	await registry.grantRole(await registry.ISSUER_ROLE(), issuer.address); 
	await registry.grantRole(await registry.ISSUER_ROLE(), signers[0].address); 
	await registry.grantRole(await registry.ISSUER_ROLE(), signers[1].address); 

	const vc = {
		"@context": "https://www.w3.org/2018/credentials/v1",
		id: "73bde252-cb3e-44ab-94f9-eba6a8a2f28d",
		type: "VerifiableCredential",
		issuer: `did:lac:main:${issuer.address}`,
		issuanceDate: moment().toISOString(),
		expirationDate: moment().add( 1, 'years' ).toISOString(),
		credentialSubject: {
			id: `did:lac:main:${subject}`,
			data: 'test'
		},
		proof: []
	}
	// Hashes the data related to the VC, Issuer and the adress which receives the VC
	const credentialHash = getCredentialHash( vc, issuer, VERIFYER_ADRESS );

	// The hashed VC signed by the issuer
	const signature = await signCredential( credentialHash, issuer );

	const from = Math.round( moment( vc.issuanceDate ).valueOf() / 1000 );
	const to = Math.round( moment( vc.expirationDate ).valueOf() / 1000 );

	await registry.registerCredential( subject, credentialHash,
		from,to,
		signature, { from: issuer.address } );

		vc.proof.push( {
			id: vc.issuer,
			type: "EcdsaSecp256k1Signature2019",
			proofPurpose: "assertionMethod",
			verificationMethod: `${vc.issuer}#vm-0`,
			domain: registry.adress,
			proofValue: signature
		} );

		return vc;
}

async function verifyCredential(vc, instance) {
    const data = `0x${sha256( JSON.stringify( vc.credentialSubject ) )}`;
	const rsv = ethUtil.fromRpcSig( vc.proof[0].proofValue );
    const result = await instance.verifyCredential( [
        vc.issuer.replace( 'did:lac:main:', '' ),
        vc.credentialSubject.id.replace( 'did:lac:main:', '' ),
        data,
        Math.round( moment( vc.issuanceDate ).valueOf() / 1000 ),
        Math.round( moment( vc.expirationDate ).valueOf() / 1000 )
    ], rsv.v, rsv.r, rsv.s );

    return result;

}


async function revokeCredential(subject){
	const registryFactory = await ethers.getContractFactory("CredentialRegistry");
	const registry = await registryFactory.attach(REGISTRY_ADRESS);
	
	// Call the revokeCredential function in the CredentialRegistry contract
	const tx = await registry.revokeCredential(credentialHash);
	
	console.log("Credential has been revoked!");
	return tx; // You can return the transaction object if needed
	}

/*
async function main() {

    console.log(ethers.version);
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
	provider.getBlockNumber().then((result) => {
		console.log("Current block number: " + result);
	})

    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  	const wallet = new ethers.Wallet(privateKey, provider);

	const abiPathVerifier = "./artifacts/contracts/ClaimsVerifier.sol/ClaimsVerifier.json";
	const abiVerifier = JSON.parse(fs.readFileSync(abiPathVerifier).toString()).abi;
	
	const contract = new ethers.Contract(VERIFYER_ADRESS, abiVerifier, wallet);
	


	const credential = await registerCredential("0x2546BcD3c84621e976D8185a91A922aE77ECEc30", contract);

	console.log("Credential registered at the blockchain: ", credential);

    console.log("Contract adress: ", contract.address);

    const result = await verifyCredential(credential, contract);
	
	const credentialExists = result[0];
	const isNotRevoked = result[1];
	const issuerSignatureValid = result[2];
	const additionalSigners = result[3];
	const isNotExpired = result[4];

	console.log("Credential exists: ", credentialExists);
	console.log("Credential is not revoked: ", isNotRevoked);
	console.log("The credential signature is valid: ", issuerSignatureValid);
	console.log("The credential has additional signers: ", additionalSigners);
	console.log("the credential is not expired: ", isNotExpired);
	
	
}

  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
*/
	module.exports = {
		registerCredential,
		revokeCredential,
		getCredentialHash,
        verifyCredential
		};