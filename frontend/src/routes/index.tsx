import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import MapPage from "./pages/MapPage";
import AboutPage from "./pages/AboutPage";
import ChartPage from "./pages/ChartPage";
import { HomePage } from "./pages/HomePage";
import Map3dPage from "./pages/Map3dPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },      
      { path: "/chart", element: <ChartPage /> },
      { path: "/map", element: <MapPage /> },
      { path: "/map-3d", element: <Map3dPage />},
    ],
  },
]);

export default router;
