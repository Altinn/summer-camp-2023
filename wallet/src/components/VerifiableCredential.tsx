// import * as vc from "../assets/academic.json";

interface VerifiableCredentialProps {
  token: {
    id: string;
    type: string[];
    credentialSubject: {
      id: string;
    };
    evidence: boolean;
  };
}

function VerifiableCredential({ token }: VerifiableCredentialProps) {
  const { id, type, credentialSubject, evidence } = token;

  return (
    <div>
      <h2>Verifiable Credential</h2>
      <div>id: {id}</div>
      <div>Type:</div>
      <ul>
        {type.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div>{evidence ? "Gyldig" : "Ugyldig"}</div>
      {/* <pre>{JSON.stringify(token, null, 2)}</pre> */}
    </div>
  );
}

export default VerifiableCredential;
