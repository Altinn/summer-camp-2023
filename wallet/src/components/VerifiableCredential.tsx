import * as vc from "../assets/academic.json";

function VerifiableCredential() {
  return (
    <div>
      <pre>{JSON.stringify(vc, null, 2)}</pre>
    </div>
  );
}

export default VerifiableCredential;
