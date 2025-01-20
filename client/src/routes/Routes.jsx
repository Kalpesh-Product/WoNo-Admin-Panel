import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/LoginPage/LoginPage";
import PersistLogin from "../layouts/PersistLogin";

// Import main pages
import Dashboard from "../pages/Dashboard/Dashboard";
import Reports from "../pages/Reports";
import Calender from "../pages/Calendar";
import Access from "../pages/Access/Access";
import AccessProfile from "../pages/Access/AccessProfile";
import Notifications from "../pages/Notifications";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile/Profile";

// Import tickets pages
import TicketDashboard from "../pages/Tickets/TicketDashboard";
import ManageTickets from "../pages/Tickets/ManageTickets";
import TeamMembers from "../pages/Tickets/TeamMembers";
import TicketReports from "../pages/Tickets/TicketReports";
import RaiseTicket from "../pages/Tickets/RaiseTicket";
import TicketSettingsnew from "../pages/Tickets/TicketSettingsnew";

// Test page
import TestPage from "../pages/Test/TestPage";
import TicketLayout from "../pages/Tickets/TicketLayout";
import Compliances from "../pages/Dashboard/HrDashboard/Complaince/Compliances";
import DashboardLayout from "../pages/Dashboard/DashboardLayout";
import FrontendDashboard from "../pages/Dashboard/FrontendDashboard/FrontendDashboard";
import HrDashboard from "../pages/Dashboard/HrDashboard/HrDashboard";
import HrLayout from "../pages/Dashboard/HrDashboard/HrLayout";
import ViewEmployees from '../pages/Dashboard/HrDashboard/Complaince/ViewEmployees'
import CompanyHandbook from '../pages/Dashboard/HrDashboard/Complaince/CompanyHandbook'
import HoildaysEvents from '../pages/Dashboard/HrDashboard/Complaince/HoildaysEvents'
import OnBoarding from "../pages/Dashboard/HrDashboard/OnBoarding/OnBoarding";
import EmployeeOnboard from "../pages/Dashboard/HrDashboard/OnBoarding/EmployeeOnboard";
import MemberOnboard from "../pages/Dashboard/HrDashboard/OnBoarding/MemberOnboard";
import VendorOnboard from "../pages/Dashboard/HrDashboard/OnBoarding/VendorOnboard";
import EmployeeDetail from "../pages/Dashboard/HrDashboard/Complaince/EmployeeDetail/EmployeeDetails";
import EditDetails from "../pages/Dashboard/HrDashboard/Complaince/EmployeeDetail/EditDetails";
import Attendance from "../pages/Dashboard/HrDashboard/Complaince/EmployeeDetail/Attendance";
import Leaves from "../pages/Dashboard/HrDashboard/Complaince/EmployeeDetail/Leaves";
import Agreements from "../pages/Dashboard/HrDashboard/Complaince/EmployeeDetail/Agreements";
import KPI from "../pages/Dashboard/HrDashboard/Complaince/EmployeeDetail/KPI";
import KRA from "../pages/Dashboard/HrDashboard/Complaince/EmployeeDetail/KRA";
import Data from "../pages/Dashboard/HrDashboard/Data/HRData";
import JobApplicationList from "../pages/Dashboard/HrDashboard/Data/JobApplicationList";
import Templates from "../pages/Dashboard/HrDashboard/Data/Templates";

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
                path: "dashboard",
                element: <DashboardLayout />,
                children: [
                  {
                    path: "frontend-dashboard",
                    element: <FrontendDashboard />,
                    index: true,
                  },
                  {
                    path: "finance-dashboard",
                    element: <Dashboard />,
                  },
                  {
                    path: "hr-dashboard",
                    element: <HrLayout />,
                    children: [
                      {
                        path: "",
                        element: <HrDashboard />,
                      },
                      {
                        path: "compliances",
                        element: <Compliances />,
                        children: [
                          {
                            path: "view-employees",
                            index:true,
                            element: <ViewEmployees />,
                          },
                          {
                            path: "view-employees/:id", // Move dynamic route to the same level as view-employees
                            element: <EmployeeDetail />,
                            children:[
                              {
                                path: "edit-details",
                                element: <EditDetails />
                              },
                              {
                                path: "attendance",
                                element: <Attendance />
                              },
                              {
                                path: "leaves",
                                element: <Leaves />
                              },
                              {
                                path: "agreements",
                                element: <Agreements />
                              },
                              {
                                path: "kpi",
                                element: <KPI />
                              },
                              {
                                path: "kra",
                                element: <KRA />
                              }
                            ]
                          },
                          {
                            path: "company-handbook",
                            element: <CompanyHandbook />,
                          },
                          {
                            path: "holidays-events",
                            element: (
                              <HoildaysEvents
                                title={"Holiday & Event Listing"}
                              />
                            ),
                          },
                        ],
                      },
                      {
                        path: "onboarding",
                        element: <OnBoarding />,
                        children: [
                          {
                            path: "employee-onboarding",
                            index:true,
                            element: <EmployeeOnboard />,
                          },
                          {
                            path: "vendor-onboarding",
                            element: <VendorOnboard />,
                          },
                          {
                            path: "member-onboarding",
                            element: (
                              <MemberOnboard
                              />
                            ),
                          },
                        ],
                      },
                      {
                        path:"data",
                        element:<Data/>,
                        children: [
                          {
                            path: "job-application-list",
                            index:true,
                            element: <JobApplicationList />,
                          },
                         
                          {
                            path: "templates",
                            element: <Templates />,
                          },
                          
                        ],

                      }
                    ],
                  },
                ],
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
                path: "notifications",
                element: <Notifications />,
              },
              {
                path: "chat",
                element: <Chat />,
              },
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "test",
                element: <TestPage />,
              },

              {
                path: "tickets", // Parent path
                element: <TicketLayout />, // Parent component for tickets
                children: [
                  {
                    path: "", // Default route for /app/tickets
                    element: <TicketDashboard />, // Dashboard is rendered by default
                    index: true,
                  },
                  {
                    path: "raise-ticket",
                    element: <RaiseTicket />,
                  },
                  {
                    path: "manage-tickets",
                    element: <ManageTickets />,
                  },
                  {
                    path: "ticket-settings",
                    element: <TicketSettingsnew />,
                  },
                  {
                    path: "team-members",
                    element: <TeamMembers />,
                  },
                  {
                    path: "reports",
                    element: <TicketReports />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);
