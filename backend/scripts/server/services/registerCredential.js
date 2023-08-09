const crypto = require( 'crypto' );
const moment = require( "moment" );
const web3Abi = require( "web3-eth-abi" );
const web3Utils = require( "web3-utils" );
const ethUtil = require( "ethereumjs-util" );
const { ethers } = require("hardhat");
const fs = require("fs");

const VERIFIABLE_CREDENTIAL_TYPEHASH = web3Utils.soliditySha3( "VerifiableCredential(address issuer,address subject,bytes32 data,uint256 validFrom,uint256 validTo)" );

 //  Returns The ABI (application binary interface) signature of the event as a string 
const EIP712DOMAIN_TYPEHASH = web3Utils.soliditySha3( "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)" );

const issuer = {
    address: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 
    privateKey: 'ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
};

function sha256( data ) {
	const hashFn = crypto.createHash( 'sha256' );
	hashFn.update( data );
	return hashFn.digest( 'hex' );
}

//Generates a hash based on the VC, issuer and adress of the claims verifier
function getCredentialHash( vc, issuer, claimsVerifierContractAddress ) {

	const hashDiplomaHex = `0x${sha256( JSON.stringify( vc.credentialSubject ) )}`;
	
	
	  //  Returns The ABI (application binary interface) signature of the event as a string 
	const encodeEIP712Domain = web3Abi.encodeParameters(
		['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'], 
		[EIP712DOMAIN_TYPEHASH, web3Utils.sha3( "EIP712Domain" ), web3Utils.sha3( "1" ), 648529, claimsVerifierContractAddress] 
	);

	// Returns the SHA-256 hash of the encodeEIP712Domain variable. 
	const hashEIP712Domain = web3Utils.soliditySha3( encodeEIP712Domain );
	
	const validFrom = new Date( vc.issuanceDate ).getTime();

	const validTo = new Date( vc.expirationDate ).getTime();

	const subjectAddress = vc.credentialSubject.id.split( ':' ).slice( -1 )[0];

	// Encodes the parameters for constructing a hash of the Verifiable Credential. The hashed credential is used as part of the data that will be signed using the EIP-712 standard.

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

	// Returns a hash
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
async function registerCredential(
    subjectDID, firstName, lastName, expDate, municipality, registry, verifier_adress
    ) {

    //TODO
    //Make issuer and signers dynamic

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

    const subjectAddress = subjectDID.split( ':' ).slice( -1 )[0];

	const vc = {
		"@context": "https://www.w3.org/2018/credentials/v1",
		id: "73bde252-cb3e-44ab-94f9-eba6a8a2f28d",
		type: "VerifiableCredential",
		issuer: `did:lac:main:${issuer.address}`,
		issuanceDate: moment().toISOString(),
		expirationDate: moment(expDate, "DD-MM-YYYY").toISOString(),
		credentialSubject: {
			id: subjectDID,
			data: {
                firstName: firstName,
                lastName: lastName,
                municipality: municipality
            }
		},
		proof: []
	}
	// Hashes the data related to the VC, Issuer and the adress which receives the VC
	const credentialHash = getCredentialHash( vc, issuer, verifier_adress );
    console.log("Credential hash: ", credentialHash);
	// The hashed VC signed by the issuer
	const signature = await signCredential( credentialHash, issuer );

	const from = Math.round( moment( vc.issuanceDate ).valueOf() / 1000 );
	const to = Math.round( moment( vc.expirationDate ).valueOf() / 1000 );

	await registry.registerCredential( subjectAddress, credentialHash,
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
        vc.credentialSubject.id.replace( 'did:digdir:', '' ),
        data,
        Math.round( moment( vc.issuanceDate ).valueOf() / 1000 ),
        Math.round( moment( vc.expirationDate ).valueOf() / 1000 )
    ], rsv.v, rsv.r, rsv.s );

    return result;

}

async function revokeCredential(vc, instance, verifier_adress) {
  
    const credentialHash = getCredentialHash(vc, issuer, verifier_adress);

    const result = await instance.revokeCredential(credentialHash);

    return result;

}

	module.exports = {
		registerCredential,
		revokeCredential,
		getCredentialHash,
        verifyCredential
		};