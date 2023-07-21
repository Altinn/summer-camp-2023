import { Resolver } from "did-resolver";
import { util as ebsiUtil, getResolver } from "@cef-ebsi/ebsi-did-resolver";
import { util as keyUtil } from "@cef-ebsi/key-did-resolver";
import { getResolver as getKeyResolver } from "@cef-ebsi/key-did-resolver";
import { JWK } from "jose";

// You must set the address of the DID Registry to be used in order to resolve Legal Entities DID documents
const resolverConfig = {
  registry: "https://api-pilot.ebsi.eu/did-registry/v4/identifiers",
};

// getResolver will return an object with a key/value pair of { "ebsi": resolver } where resolver is a function used by the generic DID resolver.
const ebsiResolver = getResolver(resolverConfig);
const keyResolver = getKeyResolver();
const didResolver = new Resolver({
  ...ebsiResolver,
  ...keyResolver,
});

// function generateDID(subjectIdentifierBytes: ArrayLike<number>) {
//   const did = ebsiUtil.createDid(subjectIdentifierBytes);
//   return did;
// }

function generateDID(jwk: JWK) {
  const did = keyUtil.createDid(jwk);
  return did;
}

async function resolveDID(did: string) {
  const didDocument = await didResolver.resolve(did);
  return didDocument;
}

export { generateDID, resolveDID };
