import "./styles/input.css";
import 'mapbox-gl/dist/mapbox-gl.css';

import { Outlet } from "react-router-dom";

import AuthProvider from "./contexts/AuthContext";
import { useScrollReset } from "./hooks/useScrollReset";

function App() {
  useScrollReset();
  return (
    <>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </>
  );
}

export default App;
