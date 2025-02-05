import "./styles/input.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { Outlet } from "react-router-dom";

import AuthProvider from "./contexts/AuthProvider";
import SelectedDataContextProvider from "./contexts/SelectedDataContextProvider";
import { useScrollReset } from "./hooks/useScrollReset";

function App() {
  useScrollReset();
  return (
    <>
      <AuthProvider>
        <SelectedDataContextProvider>
          <Outlet />
        </SelectedDataContextProvider>
      </AuthProvider>
    </>
  );
}

export default App;
