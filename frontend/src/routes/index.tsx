import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/HomePage";

import App from "@/App";
import MapPage from "./pages/MapPage";
import ChartPage from "./pages/ChartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
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
    ]
  }
]);

export default router;
