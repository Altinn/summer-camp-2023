import { useState, useEffect } from "react";
import "./App.css";
import * as vc from "./assets/academic.json";
import VerifiableCredential from "./components/VerifiableCredential";
import { generateDID, resolveDID } from "./utils/did";
import { createRandomBytes } from "./utils/randomBytes";
import * as key from "./assets/jwk.json";
import { useSessionStorage } from "usehooks-ts";

function App() {
  const [DID, setDID] = useState("");
  const [valid, setValid] = useState<"Gyldig" | "Ugyldig">("Ugyldig");
  const [DIDdoc, setDIDdoc] = useSessionStorage("DID-document", "null");

  function handleGenerateDID() {
    const jwk = {
      kty: key.kty,
      crv: key.crv,
      kid: key.kid,
      x: key.x,
      y: key.y,
    };
    // setDID("did:ebsi:ziDnioxYYLW1a3qUbqTFz4W"); // Garantert gyldig Legal Entity DID
    // setDID(generateDID(createRandomBytes(16)));
    setDID(generateDID(jwk));
  }

  useEffect(() => {
    resolveDID(DID)
      .then((res) => {
        setDIDdoc(JSON.stringify(res.didDocument, null, 2));
      })
      .catch((err) => console.log(err));
  }, [DID, setDIDdoc]);

  useEffect(() => {
    console.log(DIDdoc);
    DIDdoc !== "null" ? setValid("Gyldig") : setValid("Ugyldig");
  }, [DIDdoc]);

  function clearSession() {
    setDID("");
    sessionStorage.clear();
    // window.location.reload();
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
        {DID ? DID : "\n"}
      </pre>
      <pre>
        <br />
        <b>DID Document:</b>
        <pre>
          <br />
          {valid}
        </pre>
        <br />
        <br />
        {DIDdoc}
      </pre>
      <div>
        <br />
        <button onClick={clearSession}>Clear session</button>
        <br />
        <br />
      </div>
    </>
  );
}

export default App;
