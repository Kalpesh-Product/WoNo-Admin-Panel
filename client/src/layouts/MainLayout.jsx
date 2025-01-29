import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import BreadCrumbComponent from "../components/BreadCrumbComponent";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      <div className="w-full flex flex-col justify-between h-[110vh] overflow-y-auto hideScrollbar">
        <header className=" flex w-full shadow-md">
          <Header />
        </header>
        <div className="flex w-full">
          <aside className=" bg-white">
            <Sidebar />
          </aside>
          <div className="w-full">
            <main className="w-full bg-[#F7F8FA] p-3 flex flex-col gap-2">
              <div className=" p-4  rounded-t-md bg-white">
                <BreadCrumbComponent />
              </div>
              <div className="bg-white h-[80vh] overflow-y-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
