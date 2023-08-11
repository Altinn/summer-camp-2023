<h1>Backend for Summerproject 2023</h1>

<h2>Insalling</h2>

Clone the repository.
cd .\summer-camp-2023\backend

install nescecary deppendencies:
npm i -f

compile:
npx hardhat compile

start the blockchain local instance:
npx hardhat node

Deploy the smart contracts:
npx hardhat run --network localhost scripts/deploy.js






npm i to install dependencies

npx hardhat node for starting the blockchain

npx hardhat run --network localhost scripts/deploy.js for depploying the smart contracts

node scripts/server/index.js for starting the server
