import { useScrollReset } from "./hooks/useScrollReset";
import "./styles/input.css";

import { Outlet } from "react-router-dom";

function App() {
  useScrollReset();
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
