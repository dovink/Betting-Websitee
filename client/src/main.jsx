import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/Home/HomePage";
import RegisterPage from "./pages/Register/RegisterPage";
import LoginPage from "./pages/Login/LoginPage";
import "./assets/index.css";
import EmailVerify from "./pages/EmailVerify/EmailVerify";

const router = createBrowserRouter([
   {
      path: "/",
      element: <HomePage />
   },
   {
      path: "/register",
      element: <RegisterPage />
   },
   {
      path: "/login",
      element: <LoginPage />
   },
   {
      path: "/:id/verify/:token/",
      element: <EmailVerify />
   },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <RouterProvider router={router} />
   </React.StrictMode>
);
