<h1>Backend for Summerproject 2023</h1>

<h2>Insalling</h2>

Clone the repository.
cd .\summer-camp-2023\backend

install nescecary deppendencies:
npm i 

compile:
npx hardhat compile

start the blockchain local instance:
npx hardhat node

Deploy the smart contracts:
npx hardhat run --network localhost scripts/deploy.js

Start the server:
node scripts/server/index.js


<h2>The Blockchain</h2>

In this repository are the smart contracts based on EIP-712 and EIP-1812 for Structured Data Types and Verifiable Claims respectively, to perform the registration and verification process of Verifiable Credentials on-chain.

<h3>Structure</h3>
![My Image](backend\Resources\structure-backend.png)


The main objective is to have a credential registry for creating Liquor liscence and knowledge test verifiable credentials. There is the CredentialRegistry whose function is to maintain the main registry. However, it is not intended to interact directly with applications. 
That is why there is a contract that serves as a middleman to be able to register each type of credential, this contract is called ClaimsVerifier, and it is in charge of both registering credential hashes and verifying them by making internal calls to the CredentialRegistry. 

<h3>Contracts: </h3>

* __CredentialRegistry:__ Master credential registry

* __AbstractClaimsVerifier:__ Abstract class that represents a credential verifier

* __ClaimsVerifier:__ Class that allows verifying a specific type of credential. Receive the CredentialRegistry adress as a constructor argument.

* __ClaimTypes:__ Generic class that defines EIP712 domain types for credentials. 

* __ICredentialRegistry:__ Interface that defines the main methods of a CredentialRegistry, as well as the metadata of each credential. 

<h3>Security roles</h3>

The contracts make use of the OpenZeppelin Access Control System, for which two roles have been defined:

* __ISSUER_ROLE__

* __SIGNER_ROLE__

The ISSUER_ROLE should be assigned to any account that is going to register a credential in the ClaimsVerifier contract.

The SIGNER_ROLE should be assigned to any account that is going to sign a credential within the ClaimsVerifier contract.

<H3>Pre-requisites</H3>

NodeJS > 12.4

Etehrs @ 5.7.2

OpenZeppelin Contracts @ 3.0.0







