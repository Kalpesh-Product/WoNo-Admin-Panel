import { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs } from "@mui/material";
import useAuth from "../../../../hooks/useAuth";

const OnBoarding = () => {
  const { auth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Define available tabs (before filtering)
  const allTabs = [
    { label: "Employee Onboarding", path: "employee-onboarding" },
    { label: "View Employee", path: "view-employees" },
  ];

  // Extract permitted submodules for "Employee"
  const permittedSubmodules = new Set();

  auth.user.permissions?.deptWisePermissions?.forEach((department) => {
    department.modules.forEach((module) => {
      if (module.moduleName === "Employee") {
        module.submodules.forEach((submodule) => {
          if (submodule.actions.includes("View")) {
            permittedSubmodules.add(submodule.submoduleName);
          }
        });
      }
    });
  });

  // Filter tabs based on permissions
  const filteredTabs = allTabs.filter((tab) =>
    permittedSubmodules.has(tab.label)
  );

  // Redirect user to the first permitted tab if they try to access Employee directly
  useEffect(() => {
    const basePath = "/app/dashboard/HR-dashboard/employee/";
    const pathAfterEmployee = location.pathname.startsWith(basePath)
      ? location.pathname.substring(basePath.length) // Extract subpath
      : "";

    // ✅ 1. If the user is on "/employee" without a subpath, redirect to the first allowed tab
    if (!pathAfterEmployee || pathAfterEmployee === "employee") {
      if (filteredTabs.length > 0) {
        navigate(`${basePath}${filteredTabs[0].path}`, { replace: true });
      }
      return;
    }

    // ✅ 2. Check if the subpath is authorized
    const isAuthorized = filteredTabs.some(
      (tab) => tab.path === pathAfterEmployee
    );

    if (!isAuthorized) {
      console.warn("Unauthorized access detected:", location.pathname);
      navigate("/unauthorized", { replace: true }); // Redirect to Unauthorized page
    }
  }, [location.pathname, navigate, filteredTabs]);

  // Determine active tab based on location
  const activeTab = filteredTabs.findIndex((tab) =>
    location.pathname.includes(tab.path)
  );

  return (
    <div className="p-4">
      {filteredTabs.length > 0 && (
        <Tabs
          value={activeTab}
          variant="fullWidth"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            border: "1px solid #d1d5db",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "medium",
              padding: "12px 16px",
              borderRight: "0.1px solid #d1d5db",
            },
            "& .Mui-selected": {
              backgroundColor: "#1E3D73", // Highlight background color for the active tab
              color: "white",
            },
          }}
        >
          {filteredTabs.map((tab, index) => (
            <NavLink
              key={index}
              className={"border-r-[1px] border-borderGray"}
              to={tab.path}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: isActive ? "white" : "#1E3D73",
                flex: 1,
                textAlign: "center",
                padding: "12px 16px",
                display: "block",
                backgroundColor: isActive ? "#1E3D73" : "white",
              })}
            >
              {tab.label}
            </NavLink>
          ))}
        </Tabs>
      )}

      <div className="py-4 bg-white">
        {/* Render the nested routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default OnBoarding;
