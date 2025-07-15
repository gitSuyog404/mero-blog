import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Homepage from "./pages/HomePage/Homepage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Homepage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
