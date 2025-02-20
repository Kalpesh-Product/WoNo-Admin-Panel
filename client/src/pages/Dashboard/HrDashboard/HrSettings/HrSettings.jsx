
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const HrSettings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map routes to tabs
  const tabs = [
    { label: "Company Logo", path: "company-logo" },
    { label: "Departments", path: "departments" },
    { label: "Work Locations", path: "work-locations" },
    { label: "Leave Type", path: "leave-type" },
    { label: "Policies", path: "policies" },
    { label: "SOPs", path: "sops" },
    { label: "Employee Types", path: "employee-type" },
    { label: "Shifts", path: "shifts" },
    { label: "Templates", path: "templates" },
  ];

  // Redirect to "view-employees" if the current path is "/hr-dashboard/compliances"
  useEffect(() => {
    if (location.pathname === "/app/dashboard/HR-dashboard/settings") {
      navigate("/app/dashboard/HR-dashboard/settings/bulk-upload", {
        replace: true,
      });
    }
  }, [location, navigate]);

  // Determine whether to show the tabs
  // const showTabs = !location.pathname.includes("budget/");

  // Determine active tab based on location
  // const activeTab = tabs.findIndex((tab) =>
  //   location.pathname.includes(tab.path)
  // );

  return (
    <div className="p-4">
      {/* Render tabs only if the current route is not EmployeeDetails */}
      

      <div className="py-4">
        <Outlet />
      </div>
    </div>
  );
};

export default HrSettings;
