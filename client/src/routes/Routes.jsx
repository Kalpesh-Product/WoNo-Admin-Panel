import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import Reports from "../pages/Reports";
import Dashboard from "../pages/Dashboard/Dashboard";
import Calender from "../pages/Calendar";
import Access from "../pages/Access/Access";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile/Profile";
import AccessProfile from "../pages/Access/AccessProfile";

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
        path: "reports", 
        element: <Reports />,
      },
      {
        path: "calendar", 
        element: <Calender />,
      },
      {
        path: "access", 
        element: <Access />,
      },
      {
        path: "access/permissions", 
        element: <AccessProfile />,
      },
      {
        path: "chat", 
        element: <Chat/>,
      },
      {
        path:"profile",
        element:<Profile/>,
      }
    ],
  },
]);


