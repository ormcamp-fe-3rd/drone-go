import "./styles/input.css";
import 'mapbox-gl/dist/mapbox-gl.css';

import { Outlet } from "react-router-dom";

import AuthProvider from "./contexts/AuthProvider";
import { CurrentTimeProvider } from "./contexts/CurrentTimeContext";
import PhaseContextProvider from "./contexts/PhaseContext";
import SelectedDataContextProvider from "./contexts/SelectedDataContextProvider";
import { useScrollReset } from "./hooks/useScrollReset";

function App() {
  useScrollReset();
  return (
    <>
      <AuthProvider>
        <SelectedDataContextProvider>
          <CurrentTimeProvider>
            <PhaseContextProvider>
              <Outlet />
            </PhaseContextProvider>
          </CurrentTimeProvider>
        </SelectedDataContextProvider>
      </AuthProvider>
    </>
  );
}

export default App;
