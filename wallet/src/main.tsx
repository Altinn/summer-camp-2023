import React from "react";
import ReactDOM from "react-dom/client";
import "./index.sass";
import Wallet from "./routes/wallet.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/error-page.tsx";
import Root from "./routes/root.tsx";
import RedirectComponent from "./components/RedirectComponent.tsx";
import Add from "./routes/add.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RedirectComponent path="/wallet" />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "wallet",
        element: <Wallet />,
      },
      {
        path: "add",
        element: <Add />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
