import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/HomePage";

import App from "@/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      // {path: "/", element: <Home />}
    ],
  },
]);

export default router;
