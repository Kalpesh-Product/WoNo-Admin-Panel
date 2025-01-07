import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import Reports from "../pages/Reports";
import Dashboard from "../pages/Dashboard/Dashboard";
import Calender from "../pages/Calendar";
import Access from "../pages/Access";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: <MainLayout />,
    children: [
      {
        path: "frontend-dashboard", // Accessible at /frontend-dashboard
        element: <Dashboard />,
      },
      {
        path: "finance-dashboard", // Accessible at /finance-dashboard
        element: <Dashboard />,
      },
      {
        path: "hr-dashboard", // Accessible at /hr-dashboard
        element: <Dashboard />,
      },
      {
        path: "reports", // Accessible at /reports
        element: <Reports />,
      },
      {
        path: "calendar", // Accessible at /reports
        element: <Calender />,
      },
      {
        path: "access", // Accessible at /reports
        element: <Access />,
      },
    ],
  },
  {
    path:"access",
    element:<Access/>

  }
]);

