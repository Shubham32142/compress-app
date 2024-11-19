import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import VideoDownload from "./components/DownloadVideos.jsx";
const appRouter = createBrowserRouter([
  {
    path: "",
    element: <App />,
  },
  {
    path: "/download/:id",
    element: <VideoDownload />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={appRouter}></RouterProvider>
  </StrictMode>
);
