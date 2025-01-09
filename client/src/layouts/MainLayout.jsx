import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <div className="w-full">
      <div className="flex w-full">
        <aside className="h-screen bg-white">
          <Sidebar />
        </aside>
        <div className="w-full">
          <header className=" flex w-full shadow-md">
            <Header />
          </header>
          <main className="w-full bg-[#F7F8FA] h-[90vh] overflow-y-auto p-3">
            <div className="bg-white">
              <div className=" p-4 pb-0 rounded-t-md">
                <span className="mb-0 ">breacrumb here</span>
              </div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
