import { useState } from "react";
import "./App.css";
import * as vc from "./assets/academic.json";
import VerifiableCredential from "./components/VerifiableCredential";
import { generateDID, resolveDID } from "./utils/did";
import { createRandomBytes } from "./utils/randomBytes";
import * as key from "./assets/jwk.json";

function App() {
  const [DID, setDID] = useState("");
  const [valid, setValid] = useState<string | undefined>("");
  const [DIDdoc, setDIDdoc] = useState("");

  function handleGenerateDID() {
    const jwk = {
      kty: key.kty,
      crv: key.crv,
      kid: key.kid,
      x: key.x,
      y: key.y,
    };
    console.log(jwk);
    // setDID(generateDID(createRandomBytes(16)));
    setDID(generateDID(jwk));
  }

  function handleValidateDID() {
    resolveDID(DID)
      // resolveDID("did:ebsi:ziDnioxYYLW1a3qUbqTFz4W")
      // .then((res) => console.log(res))
      .then((res) => {
        if (res.didDocument === null) {
          setValid(res.didResolutionMetadata.error);
        } else {
          setValid(res.didDocument.id);
          setDIDdoc(JSON.stringify(res.didDocument, null, 2));
          console.log(res.didDocument);
        }
      })
      .catch(() => "error");
  }

  return (
    <>
      <VerifiableCredential token={vc} />
      <div>
        <br />
        <br />
        <br />
        <button onClick={handleGenerateDID}>Generer DID</button>
      </div>
      <pre>
        <br />
        {DID ? DID : "-"}
      </pre>
      <div>
        <br />
        <br />
        <br />
        <button onClick={handleValidateDID}>Valider DID</button>
      </div>
      <pre>
        <br />
        {valid ? valid : "-"}
      </pre>
      <pre>
        <br />
        <b>DID Document:</b>
        <br />
        <br />
        {DIDdoc ? DIDdoc : "-"}
      </pre>
    </>
  );
}

export default App;
