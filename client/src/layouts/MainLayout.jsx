import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <div className="">
        <div>
          <h1>Sidebar here</h1>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
