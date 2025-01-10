import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import ChartPage from "./pages/ChartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "chart", element: <ChartPage /> },
      // {path: "/", element: <Home />}\
    ],
  },
]);

export default router;
