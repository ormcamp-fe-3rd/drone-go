import "./styles/input.css";
import 'mapbox-gl/dist/mapbox-gl.css';

import { Outlet } from "react-router-dom";

import AuthProvider from "./contexts/AuthProvider";
import PhaseContextProvider from "./contexts/PhaseContext";
import { CurrentTimeProvider } from "./contexts/CurrentTimeContext";
import { useScrollReset } from "./hooks/useScrollReset";

function App() {
  useScrollReset();
  return (
    <>
      <AuthProvider>
        <CurrentTimeProvider>
          <PhaseContextProvider>
            <Outlet />
          </PhaseContextProvider>
        </CurrentTimeProvider>
      </AuthProvider>
    </>
  );
}

export default App;
