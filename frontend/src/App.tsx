import "./styles/input.css";
import 'mapbox-gl/dist/mapbox-gl.css';

import { Outlet } from "react-router-dom";

import AuthProvider from "./contexts/AuthProvider";
import PhaseContextProvider from "./contexts/PhaseContext";
import { useScrollReset } from "./hooks/useScrollReset";

function App() {
  useScrollReset();
  return (
    <>
      <AuthProvider>
        <PhaseContextProvider>
          <Outlet />
        </PhaseContextProvider>
      </AuthProvider>
    </>
  );
}

export default App;
