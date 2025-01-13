import "./styles/input.css";

import { Outlet } from "react-router-dom";

import { Header } from "./components/main/Header";

function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
