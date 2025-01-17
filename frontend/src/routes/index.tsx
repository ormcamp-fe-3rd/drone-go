import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import MapPage from "./pages/MapPage";
import AboutPage from "./pages/AboutPage";
import ChartPage from "./pages/ChartPage";
import { HomePage } from "./pages/HomePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // {path: "/", element: <Home />}
      {
        path: "/map",
        element: <MapPage />
      },

      { path: "chart",
        element: <ChartPage />
      },

      { path: "/",
        element: <HomePage />
      },

      { path: "/about",
        element: <AboutPage />
      }
    ]
  }
]);

export default router;
