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
import ViewEmployees from "../pages/Dashboard/HrDashboard/Complaince/ViewEmployees";
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
import HrFinance from "../pages/Dashboard/HrDashboard/Finance/HrFinance";
import HrBudget from "../pages/Dashboard/HrDashboard/Finance/HrBudget";
import HrPayment from "../pages/Dashboard/HrDashboard/Finance/HrPayment";
import HrSettings from "../pages/Dashboard/HrDashboard/HrSettings/HrSettings";
import CompanyLogo from "../pages/Dashboard/HrDashboard/HrSettings/CompanyLogo";
import HrSettingsDepartments from "../pages/Dashboard/HrDashboard/HrSettings/HrSettingsDepartments";
import WorkLocations from "../pages/Dashboard/HrDashboard/HrSettings/WorkLocations";
import LeaveType from "../pages/Dashboard/HrDashboard/HrSettings/LeaveType";
import HrSettingsPolicies from "../pages/Dashboard/HrDashboard/HrSettings/HrSettingsPolicies";
import HrSOP from "../pages/Dashboard/HrDashboard/HrSettings/HrSOP";
import EmployeeType from "../pages/Dashboard/HrDashboard/HrSettings/EmployeeType";
import Shifts from "../pages/Dashboard/HrDashboard/HrSettings/Shifts";
import Payslip from "../pages/Dashboard/HrDashboard/Complaince/EmployeeDetail/Payslip";
import ViewVendors from "../pages/Dashboard/HrDashboard/Complaince/ViewVendors";
import HrPayroll from "../pages/Dashboard/HrDashboard/Finance/HrPayroll";
import ViewPayroll from "../pages/Dashboard/HrDashboard/Finance/ViewPayroll";
import HrReports from "../pages/Dashboard/HrDashboard/Data/Reports"
import BulkUpload from "../pages/Dashboard/HrDashboard/HrSettings/BulkUpload";

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
                    path: "HR-dashboard",
                    element: <HrLayout />,
                    children: [
                      {
                        path: "",
                        element: <HrDashboard />,
                      },
                      {
                        path: "company",
                        element: <Compliances />,
                        children: [
                          {
                            path: "company-logo",
                            element: <CompanyLogo />,
                          },
                          {
                            path: "departments",
                            element: <HrSettingsDepartments />,
                          },
                          {
                            path: "work-locations",
                            element: <WorkLocations />,
                          },
                          {
                            path: "leave-types",
                            element: <LeaveType />,
                          },
                          {
                            path: "policies",
                            element: <HrSettingsPolicies />,
                          },
                          {
                            path: "sops",
                            element: <HrSOP />,
                          },
                          {
                            path: "employee-type",
                            element: <EmployeeType />,
                          },
                          {
                            path: "shifts",
                            element: <Shifts />,
                          },
                          {
                            path: "vendor-onboarding",
                            element: <VendorOnboard />,
                          },
                          {
                            path: "vendor-onboarding/vendor-details/:id",
                            element: <ViewVendors />,
                          },
                          {
                            path: "templates",
                            element: <Templates />,
                          },
                        ],
                      },
                      {
                        path: "employee",
                        element: <OnBoarding />,
                        children: [
                          {
                            path: "employee-onboarding",
                            index: true,
                            element: <EmployeeOnboard />,
                          },
                          {
                            path: "view-employees",
                            element: <ViewEmployees />,
                          },
                          {
                            path: "view-employees/:id", // Move dynamic route to the same level as view-employees
                            element: <EmployeeDetail />,
                            children: [
                              {
                                path: "edit-details",
                                element: <EditDetails />,
                              },
                              {
                                path: "attendance",
                                element: <Attendance />,
                              },
                              {
                                path: "leaves",
                                element: <Leaves />,
                              },
                              {
                                path: "agreements",
                                element: <Agreements />,
                              },
                              {
                                path: "kpi",
                                element: <KPI />,
                              },
                              {
                                path: "kra",
                                element: <KRA />,
                              },
                              {
                                path: "payslip",
                                element: <Payslip />,
                              },
                            ],
                          },

                          {
                            path: "member-onboarding",
                            element: <MemberOnboard />,
                          },
                        ],
                      },
                      {
                        path: "data",
                        element: <Data />,
                        children: [
                          {
                            path: "job-application-list",
                            index: true,
                            element: <JobApplicationList />,
                          },

                          {
                            path: "reports",
                            
                            element: <HrReports />,
                          },
                        ],
                      },
                      {
                        path: "finance",
                        element: <HrFinance />,
                        children: [
                          {
                            path: "budget",
                            index: true,
                            element: <HrBudget />,
                          },
                          {
                            path: "payment-schedule",
                            element: <HrPayment />,
                          },
                          {
                            path: "payroll",
                            element: <HrPayroll />,
                          },
                          {
                            path: "payroll/view-payroll",
                            element: <HrPayroll />,
                          },
                          {
                            path: "payroll/view-payroll/:id",
                            element: <ViewPayroll />,
                          },
                        ],
                      },
                      {
                        path: "settings",
                        element: <HrSettings />,
                        children: [
                          {
                            path: "bulkupload",
                            element: <BulkUpload/>,
                          },
                          // {
                          //   path: "company-logo",
                          //   index:true,
                          //   element: <CompanyLogo />,
                          // },
                          // {
                          //   path: "departments",
                          //   element: <HrSettingsDepartments />,
                          // },
                          // {
                          //   path: "work-locations",
                          //   element: <WorkLocations />,
                          // },
                          // {
                          //   path: "leave-type",
                          //   element: <LeaveType />,
                          // },
                          // {
                          //   path: "policies",
                          //   element: <HrSettingsPolicies />,
                          // },
                          // {
                          //   path: "sops",
                          //   element: <HrSOP />,
                          // },
                          // {
                          //   path: "employee-type",
                          //   element: <EmployeeType />,
                          // },
                          // {
                          //   path: "shifts",
                          //   element: <Shifts />,
                          // },
                        ],
                      },
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
