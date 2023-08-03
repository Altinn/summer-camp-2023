const express = require('express');
const ethers = require('ethers');
const path = require('path');
const fs = require('fs');
const {registerCredential, verifyCredential, revokeCredential} = require("./services/registerCredential.js");
const exp = require('constants');

const app = express();
const port = 5000;

//app.use(cors());
app.use(express.json());

// Address of claims_Verifyer
const VERIFYER_ADRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
const REGISTRY_ADRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
      provider.getBlockNumber().then((result) => {
          console.log("Current block number: " + result);
      })
  
      const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        const wallet = new ethers.Wallet(privateKey, provider);
  
      const abiPathVerifier = "./artifacts/contracts/ClaimsVerifier.sol/ClaimsVerifier.json";
      const abiVerifier = JSON.parse(fs.readFileSync(abiPathVerifier).toString()).abi;
      
      const contract = new ethers.Contract(VERIFYER_ADRESS, abiVerifier, wallet);

      const abiPathRegistry = "./artifacts/contracts/CredentialRegistry.sol/CredentialRegistry.json";
      const abiRegistry = JSON.parse(fs.readFileSync(abiPathRegistry).toString()).abi;

      const registry = new ethers.Contract(REGISTRY_ADRESS, abiRegistry, wallet);


app.post('/register', async (req, res) => {
    try {

        const { did, firstName, lastName, expDate, location, municipality, alcoGroup } = req.body;
        console.log(did)

        //save data to a local file
        const jsonData = JSON.stringify(req.body);
        fs.writeFileSync('data.json', jsonData);
        console.log("Data saved in local file successfully");

        if(!did) {
            return res.status(400).json({error: "DID is required"})
        }

        
  
      const credential = await registerCredential(did, firstName, lastName, expDate, location, municipality, alcoGroup, contract);
      res.status(201);
      res.send(credential);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
    
  });

app.post('/verify', async (req, res) => {
  const { vc } = req.body;
  console.log(result[0]);
  console.log(result[1]);
  console.log(result[2]);
  console.log(result[3]);
  console.log(result[4]);

  const result = await verifyCredential(vc, contract);
  if(result[0] == true && result[1] == true && result[2] == true && result[3] == true && result[4] ==true){
    res.send(true);
  }else res.send(false);
  
})

app.post("/revoke", async (req, res) => {

    const {vc} = req.body;

    const result = await revokeCredential(vc, registry);

    res.send(result[0]);

})

// DELETE endpoint to cleqar the file
  app.delete('/clear', (req, res) => {
    try {

      fs.writeFileSync('data.json', '{}');
      res.status(200).send('Fle cleared successfully');
    } catch (error) {
      console.error('Error clearing file', error);
      res.status(500).send('Error clearing file');
    }
  });


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