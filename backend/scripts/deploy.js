const { ethers } = require("hardhat");
const fs = require("fs");

async function main () {

  const provider = new ethers.providers.JsonRpcProvider(" http://127.0.0.1:8545/");

  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(wallet.address);

    const bytecodeFileRegistry = fs.readFileSync("./artifacts/contracts/CredentialRegistry.sol/CredentialRegistry.json").toString();
    const bytecodeRegistry = JSON.parse(bytecodeFileRegistry).bytecode;
    const abiPathRegistry = "./artifacts/contracts/CredentialRegistry.sol/CredentialRegistry.json";
    const abiRegistry = JSON.parse(fs.readFileSync(abiPathRegistry).toString()).abi;

    const bytecodeFileVerifyer = fs.readFileSync("./artifacts/contracts/ClaimsVerifier.sol/ClaimsVerifier.json").toString();
    const bytecodeVerifyer = JSON.parse(bytecodeFileVerifyer).bytecode;
    const abiPathVerifyer = "./artifacts/contracts/ClaimsVerifier.sol/ClaimsVerifier.json";
    const abiVerifyer = JSON.parse(fs.readFileSync(abiPathVerifyer).toString()).abi;

    const registryFactory = new ethers.ContractFactory(abiRegistry, bytecodeRegistry, wallet);
    const registryContract = await registryFactory.deploy();
    await registryContract.deployed();
    console.log("Registry deployed to adress: ", registryContract.address);

    const verifyerFactory = new ethers.ContractFactory(abiVerifyer, bytecodeVerifyer, wallet);
    const verifyeContract = await verifyerFactory.deploy(registryContract.address);
    await verifyeContract.deployed();
    console.log("Verifyer deployed to: ", verifyeContract.address);

    console.log("Assigning roles...");
    await registryContract.grantRole( await registryContract.ISSUER_ROLE(), verifyeContract.address);
    console.log("Roles has been Assigned!");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })