const express = require('express');
const ethers = require('ethers');
const path = require('path');
const fs = require('fs');
const {registerCredential} = require("./services/registerCredential.js");

const app = express();
const port = 5000;

// Example adress for registry
const REGISTRY_ADRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

// Example adress for verification
const VERIFYER_ADRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";


app.get('/', async (req, res) => {
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
      
      /*
      const registryFactory = await ethers.getContractFactory("ClaimsVerifier");
      const registry = await registryFactory.attach(VERIFYER_ADRESS);
      */
      //const subject = "0x2546BcD3c84621e976D8185a91A922aE77ECEc30";
  
      const credential = await registerCredential("0x2546BcD3c84621e976D8185a91A922aE77ECEc30", contract);

      res.send(credential);
  })


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });