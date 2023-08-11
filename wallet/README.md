# Wallet

This project uses the [Learner Credential Wallet](https://github.com/digitalcredentials/learner-credential-wallet) by The Digital Credentials Consortium.

For development setup, please refer to their [README](https://github.com/digitalcredentials/learner-credential-wallet#development-setup)

**Note!** It is vital to use the correct versions of the dependencies for the wallet to work.
We developed using node version 16.13.2, and java version 11.0.20.

> NB! No longer using custom wallet, code is deprecated. Use the [Learner Credential Wallet](#wallet) instead. The following instructions are kept for reference.

## Development

Clone the repository and run `npm install` to install dependencies.

Create a Json Web Key (JWK) for the wallet to use, and place it in the `src/assets` folder as `jwk.json`.

A JWK can be generated in several ways:

- Using the [JWK Generator](https://mkjwk.org/)
   1. Select the `EC` algorithm with the `P-256` curve, key use `Encryption`, algorithm `ECDH-ES+A128KW`, and key ID `SHA-256`.
   2. Copy the public key, and paste it into the `jwk.json` file.
- Using the [json-web-key-generator](https://github.com/bspk/json-web-key-generator):
   1. Clone the repository and run `mvn package` to compile the project.
   2. Run `java -jar target/json-web-key-generator-0.9-SNAPSHOT-jar-with-dependencies.jar -t EC -c P-256 -p -o path/to/directory -P path/to/directory` to generate a JWK. Replace `path/to/directory` with the path to the directory where you want to save the JWK.

### Running the wallet

Run `npm run dev` to start the wallet in development mode.

### Building the wallet for production

Run `npm run build` to build the wallet for production.

The build artifacts will be stored in the `dist/` directory.

The build artifacts can be served using any static file server, or by running `npm run preview`.
