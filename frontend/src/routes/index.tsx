import { createBrowserRouter } from "react-router-dom";

import App from "@/App";


import AboutPage from "./pages/AboutPage";
import ChartPage from "./pages/ChartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/chart", element: <ChartPage /> },
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },      
      { path: "/map-3d", element: <Map3dPage />},
    ],
  },
]);

export default router;
