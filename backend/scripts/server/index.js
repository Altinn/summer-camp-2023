const express = require('express');
const ethers = require('ethers');
const path = require('path');
const fs = require('fs');
const {registerCredential} = require("./services/registerCredential.js");

const app = express();
const port = 5000;
app.use(express.json());

// Address of claims_Verifyer
const VERIFYER_ADRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";


app.post('/register', async (req, res) => {
    try {

        const { did } = req.body;
        console.log(did)
        if(!did) {
            return res.status(400).json({error: "DID is required"})
        }

        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
      provider.getBlockNumber().then((result) => {
          console.log("Current block number: " + result);
      })
  
      const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        const wallet = new ethers.Wallet(privateKey, provider);
  
      const abiPathVerifier = "./artifacts/contracts/ClaimsVerifier.sol/ClaimsVerifier.json";
      const abiVerifier = JSON.parse(fs.readFileSync(abiPathVerifier).toString()).abi;
      
      const contract = new ethers.Contract(VERIFYER_ADRESS, abiVerifier, wallet);
  
      const credential = await registerCredential(did, contract);
      res.status(201);
      res.send(credential);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
    
  })

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal Server Error',
      },
    });
  });


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });