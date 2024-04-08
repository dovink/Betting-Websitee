import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import IndexPage from "./pages/Index/IndexPage";
import HomePage from "./pages/Home/HomePage";
import RegisterPage from "./pages/Register/RegisterPage";
import LoginPage from "./pages/Login/LoginPage";
import "./assets/index.css";
import EmailVerify from "./pages/EmailVerify/EmailVerify";
import Navigation from "./components/Navigation";

// function Layout() {
//    return (
//       <>
//          <Navigation />
//          <Outlet />
//       </>
//    );
// }

const router = createBrowserRouter([
   {
      path: "/",
      element: <IndexPage />,
   },
   {
      path: "/register",
      element: <RegisterPage />,
   },
   {
      path: "/login",
      element: <LoginPage />,
   },
   // {
   //    element: <Layout />,
   //    errorElement: <ErrorPage />,
   //    children: [
   //    ],
   // },
   {
      path: "/home",
      element: <HomePage />,
   },
   {
      path: "/:id/verify/:token/",
      element: <EmailVerify />,
   },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <RouterProvider router={router} />
   </React.StrictMode>
);
