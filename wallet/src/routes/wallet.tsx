import { useState, useEffect } from "react";
import style from "./wallet.module.sass";
// import * as vc from "./assets/academic.json";
// import VerifiableCredential from "./components/VerifiableCredential";
import { generateDID, resolveDID } from "../utils/did";
// import { createRandomBytes } from "./utils/randomBytes";
import * as key from "../assets/jwk.json";
import { useSessionStorage } from "usehooks-ts";
import { JWK } from "jose";
import localforage from "localforage";
import { Button } from "@digdir/design-system-react";

function Wallet() {
  const [DID, setDID] = useState("");
  const [valid, setValid] = useState<"Gyldig" | "Ugyldig">("Ugyldig");
  const [DIDdoc, setDIDdoc] = useSessionStorage("DID-document", "null");

  function handleGenerateDID() {
    // setDID("did:ebsi:ziDnioxYYLW1a3qUbqTFz4W"); // Garantert gyldig Legal Entity DID
    // setDID(generateDID(createRandomBytes(16)));
    setDID(generateDID(JSON.parse(JSON.stringify(key)) as JWK));
  }

  useEffect(() => {
    resolveDID(DID)
      .then((res) => {
        setDIDdoc(JSON.stringify(res.didDocument, null, 2));
        localforage
          .setItem("DID-document", res.didDocument)
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, [DID, setDIDdoc]);

  useEffect(() => {
    DIDdoc !== "null" ? setValid("Gyldig") : setValid("Ugyldig");
  }, [DIDdoc]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files![0], "UTF-8");
    fileReader.onload = (e) => {
      try {
        setDID(generateDID(JSON.parse(e.target!.result as string) as JWK));
      } catch (err) {
        alert("Ugyldig filformat");
        clearSession();
      }
    };
  }

  function clearSession() {
    setDID("");
    sessionStorage.clear();
  }

  return (
    <div className={style.container}>
      {/* <VerifiableCredential token={vc} /> */}
      <div>
        <br />
        <input type="file" accept=".json, .txt" onChange={handleFile} />
        <br />
        <br />
        <Button
          variant="filled"
          color="danger"
          size="medium"
          onClick={handleGenerateDID}
        >
          Generer DID
        </Button>
      </div>
      <code className={style.code}>{DID ? DID : "\n"}</code>
      <code className={style.code}>
        <b>DID Document:</b>
        <br />
        <br />
        {valid}
      </code>
      <code className={style.code}>{DIDdoc}</code>
      <div>
        <br />
        <Button onClick={clearSession}>Clear session</Button>
        <br />
        <br />
      </div>
    </div>
  );
}

export default Wallet;
