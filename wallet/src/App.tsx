import "./App.css";
import * as vc from "./assets/academic.json";

function App() {
  return (
    <div>
      <pre>{JSON.stringify(vc, null, 2)}</pre>
    </div>
  );
}

export default App;
