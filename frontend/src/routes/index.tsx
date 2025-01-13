import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/HomePage";

import App from "@/App";
import ChartPage from "./pages/ChartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "chart", element: <ChartPage /> },
      { path: "/", element: <HomePage /> },

    ],
  },
]);

export default router;
