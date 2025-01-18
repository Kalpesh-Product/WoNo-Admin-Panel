import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BreadCrumbComponent from "../components/BreadCrumbComponent";

const MainLayout = () => {
  return (
    <div className="w-full">
      <header className=" flex w-full shadow-md">
        <Header />
      </header>
      <div className="flex w-full">
        <aside className="h-screen bg-white">
          <Sidebar />
        </aside>
        <div className="w-full">
          <main className="w-full bg-[#F7F8FA] h-[95vh] overflow-y-auto p-3 flex flex-col gap-2">
            <div className=" p-4  rounded-t-md bg-white">
              <BreadCrumbComponent />
            </div>
            <div className="bg-white">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
