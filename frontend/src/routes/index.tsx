import { createBrowserRouter } from "react-router-dom";

import App from "@/App";

import AboutPage from "./pages/AboutPage";
import ChartPage from "./pages/ChartPage";
import { HomePage } from "./pages/HomePage";
import Map3dPage from "./pages/Map3dPage";
import MapPage from "./pages/MapPage";
import { ScrollToTop } from "@/hooks/scroollToTop";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        {/* ScrollToTop 추가 */}
        <ScrollToTop />
        <App />
      </>
    ),
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
