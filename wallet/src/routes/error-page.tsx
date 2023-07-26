import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  let errorMessage: string;
  let errorCode: number | "???" = "???";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.error?.message || error?.statusText;
    errorCode = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Ukjent feil";
  }

  return (
    <div id="error-page">
      <h1>Oisann!</h1>
      <p>
        <i>
          {`${errorCode.toString() + ": "}`}
          {errorMessage}
        </i>
      </p>
      <img
        src="https://c.tenor.com/V6n6v8qdRn0AAAAC/tenor.gif"
        alt="cat typing on keyboard"
      />
      <p>
        Her var det visst ingenting. Prøv å gå tilbake til{" "}
        <a href="/">forsiden</a>.
      </p>
    </div>
  );
}

export default ErrorPage;
