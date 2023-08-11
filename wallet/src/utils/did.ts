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
const resolver = new Resolver({
  ...ebsiResolver,
  ...keyResolver,
});

function generateDID(key: JWK | ArrayLike<number>) {
  // veldig hacky men funker og trenger egentlig bare å bruke jwk
  if (key.length === 16) {
    const did = ebsiUtil.createDid(key as ArrayLike<number>);
    return did;
  } else {
    const did = keyUtil.createDid(key as JWK);
    return did;
  }
}

async function resolveDID(did: string) {
  const didDocument = await resolver.resolve(did);
  return didDocument;
}

export { generateDID, resolveDID };
