import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import Reports from "../pages/Reports";
import Dashboard from "../pages/Dashboard/Dashboard";
import Calender from "../pages/Calendar";
import Access from "../pages/Access/Access";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile/Profile";
import AccessProfile from "../pages/Access/AccessProfile";
import Notifications from "../pages/Notifications";
import TicketDashboard from "../pages/Tickets/TicketDashboard";
import ManageTickets from "../pages/Tickets/ManageTickets";
import PersistLogin from "../layouts/PersistLogin";
import TeamMembers from "../pages/Tickets/TeamMembers";
import Reportss from "../pages/Tickets/Reports";
import RaiseTicket from "../pages/Tickets/RaiseTicket";
import TicketSettings from "../pages/Tickets/TicketSettings";
import TicketSettingsnew from "../pages/Tickets/TicketSettingsnew";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: <PersistLogin />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/app",
            element: <MainLayout />,
            children: [
              {
                path: "frontend-dashboard", // Accessible at /frontend-dashboard
                element: <Dashboard />,
                index: true,
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
                path: "tickets",
                element: <TicketDashboard />,
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
                path: "notifications",
                element: <Notifications />,
              },
              {
                path: "access/permissions",
                element: <AccessProfile />,
              },
              {
                path: "tickets/raise-ticket",
                element: <RaiseTicket />,
              },
              {
                path: "tickets/manage-tickets",
                element: <ManageTickets />,
              },
              {
                path: "tickets/ticket-settings",
                element: <TicketSettingsnew />,
              },
              {
                path: "tickets/team-members",
                element: <TeamMembers />,
              },

              {
                path: "tickets/Reports",
                element: <Reportss />,
              },
              {
                path: "chat",
                element: <Chat />,
              },
              {
                path: "profile",
                element: <Profile />,
              },
            ],
          },
        ],
      },
      {},
    ],
  },
]);
