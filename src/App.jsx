import { useEffect } from "react";

function App() {
  useEffect(() => {
    window.location.replace("/taskflow-original/index.html");
  }, []);

  return <p>Opening TaskFlow...</p>;
}

export default App;