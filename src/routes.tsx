import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/home/homepage";
import TestMLOpsPage from "./pages/testMLOps/testMLOpsPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

export const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/dashboard",
      },
      {
        path: "/apiservices",
      },
      {
        path: "/testmlops",
        element: <TestMLOpsPage />,
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
