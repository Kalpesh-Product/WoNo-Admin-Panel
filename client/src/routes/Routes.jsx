import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import Reports from "../pages/Reports";
import FrontendDashboard from "../pages/Dashboard/FrontendDashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/frontend-dashboard",
        index:true,
        element: <FrontendDashboard />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
    ],
  },
]);
