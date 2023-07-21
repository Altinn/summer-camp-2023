import { useState } from "react";
import "./App.css";
import * as vc from "./assets/academic.json";
import VerifiableCredential from "./components/VerifiableCredential";
import { generateDID, resolveDID } from "./utils/did";
import { createRandomBytes } from "./utils/randomBytes";

function App() {
  const [DID, setDID] = useState("");
  const [valid, setValid] = useState<string | undefined>("");

  function handleGenerateDID() {
    // setDID(generateDID(createRandomBytes(16)));
    const jwk = {
      crv: "P-256",
      kty: "EC",
      x: "5cwlfgppG78lgAuQINMjfuSzYuMmlMMPvsaW9rrpY-Q",
      y: "EKKMutKdsLijKIGw1394cmnrEDzURkeJBZWpt28QfAg",
    };
    setDID(generateDID(jwk));
  }

  function handleValidateDID() {
    resolveDID(DID)
      // resolveDID("did:ebsi:ziDnioxYYLW1a3qUbqTFz4W")
      // .then((res) => console.log(res))
      .then((res) =>
        res.didDocument === null
          ? setValid(res.didResolutionMetadata.error)
          : setValid(res.didDocument.id)
      )
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
    </>
  );
}

export default App;
