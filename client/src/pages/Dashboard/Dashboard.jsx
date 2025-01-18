import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import FrontendDashboard from "./FrontendDashboard/FrontendDashboard";
import HrDashboard from "./HrDashboard/HrDashboard";

const Dashboard = () => {
  const location = useLocation(); //will need to change useLocation and use context for content rendering once the auth is done

  return (
    <div>

    </div>
  );
};

export default Dashboard;
