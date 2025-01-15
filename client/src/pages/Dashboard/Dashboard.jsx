import React from "react";
import { useLocation } from "react-router-dom";
import FrontendDashboard from "./FrontendDashboard/FrontendDashboard";
import HrDashboard from "./HrDashboard/HrDashboard";

const Dashboard = () => {
  const location = useLocation(); //will need to change useLocation and use context for content rendering once the auth is done

  return (
    <div>
      {location.pathname === "/app/frontend-dashboard" && (
        <>
        <FrontendDashboard />
        </>
      )}
      {location.pathname === "/app/hr-dashboard" && (
        <>
        <HrDashboard />
        </>
      )}
    </div>
  );
};

export default Dashboard;
