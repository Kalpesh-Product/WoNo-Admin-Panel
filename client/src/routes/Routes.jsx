import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import Reports from "../pages/Reports";
import Dashboard from "../pages/Dashboard/Dashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />, // Login Page as the default route
  },
  {
    path: "/app", // Base path for routes under MainLayout
    element: <MainLayout />, // MainLayout as the wrapper
    children: [
      {
        path: "/app/frontend-dashboard", // Accessible at /app/dashboard
        element: <Dashboard />,
      },
      {
        path: "/app/finance-dashboard", // Accessible at /app/dashboard
        element: <Dashboard />,
      },
      {
        path: "/app/hr-dashboard", // Accessible at /app/dashboard
        element: <Dashboard />,
      },
      {
        path: "reports", // Accessible at /app/reports
        element: <Reports />,
      },
    ],
  },
]);
