import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import HomePage from "@/pages/home/homepage";
import TestMLOpsPage from "@/pages/testMLOps/testMLOpsPage";
import NotFoundPage from "@/pages/ErrorPage/NotFoundPage";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import ApiServicesPage from "@/pages/apiservices/ApiServicesPage";
import UniversalErrorPage from "@/pages/ErrorPage/UniversalErrorPage";
import DashboardPage from "@/pages/dashboardPage/dashboardpage";

import ProtectedRoutes from "@/utils/protectedRoutes";

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <UniversalErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/apiservices",
            element: <ApiServicesPage />,
          },
          {
            path: "/testmlops",
            element: <TestMLOpsPage />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);
