import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import MapPage from "./pages/MapPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      // {path: "/", element: <Home />}
      {
        path: "/map",
        element: <MapPage />
      }
  ]
  }
])

export default router;