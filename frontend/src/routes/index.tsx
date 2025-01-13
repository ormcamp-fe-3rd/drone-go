import { createBrowserRouter } from "react-router-dom";

import App from "@/App";

import ChartPage from "./pages/ChartPage";
import { HomePage } from "./pages/HomePage";
import IntroducePage from "./pages/IntroducePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "chart", element: <ChartPage /> },
      { path: "/", element: <HomePage /> },
      { path: "/introduce", element: <IntroducePage />},
    ],
  },
]);

export default router;
