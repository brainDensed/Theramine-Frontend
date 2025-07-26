import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div className="text-3xl font-bold">Hello world</div>
    </div>
  );
}

export default App;
