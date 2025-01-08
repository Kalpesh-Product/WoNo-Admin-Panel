import React, { useState } from "react";
import { FaAngleDown, FaChevronUp, FaUsers } from "react-icons/fa6";
import { FaProjectDiagram, FaRegCalendarAlt, FaTasks } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { IoIosArrowForward, IoMdNotifications } from "react-icons/io";
import { SiAuthelia } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SideBarContext";
import { GiHamburgerMenu } from "react-icons/gi";
import biznestLogo from "../assets/biznest/biznest_logo.jpg";
import { MdHome } from "react-icons/md";
import { CgWebsite } from "react-icons/cg";
import { RiAdminFill } from "react-icons/ri";
import { TbCashRegister } from "react-icons/tb";
import { FaUserTie } from "react-icons/fa6";
import { TbAccessible } from "react-icons/tb";

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedModule, setExpandedModule] = useState(null);

  // Menu items array (without DASHBOARD)
  const menuItems = [
    {
      name: "Reports",
      icon: <TbReportSearch />,
      route: "/reports",
    },

    { name: "Calendar", icon: <FaRegCalendarAlt />, route: "calendar" },
    { name: "Chat", icon: <HiOutlineChatAlt2 />, route: "chat" },
    { name: "Access", icon: <SiAuthelia />, route: "access" },
    
    {
      name: "Notifications",
      icon: <IoMdNotifications />,
      route: "/notifications",
    },
    // { name: "Profile", icon: <CgProfile />, route: "/profile" },
  ];

  const defaultModules = [
    {
      id: 1,
      icon: <MdHome />,
      title: "Dashboard",
      submenus: [
        {
          id: 2,
          title: "Frontend Dashboard",
          icon: <CgWebsite />,
          route : "/app/frontend-dashboard"
        },
        {
          id: 3,
          title: "HR Dashboard",
          icon: <RiAdminFill />,
        },
        {
          id: 4,
          title: "Finance Dashboard",
          icon: <TbCashRegister />,
        },
      ],
    },
  ];

  const handleMenuOpen = (item) => {
    console.log(isSidebarOpen);
    navigate(item.route);
  };

  const toggleModule = (index) => {
    setExpandedModule((prev) => (prev === index ? null : index));
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div
      className={`flex flex-col p-2 h-screen bg-gray ${
        isSidebarOpen && "shadow-md"
      }`}
    >
      <div
        className={`w-full border-b-2 border-gray-200 mb-4 flex ${
          isSidebarOpen ? "justify-between px-3 py-4" : "justify-center py-4"
        } transition-all duration-100 items-center`}
      >
        <div className={`${isSidebarOpen ? "w-32" : "hidden"}  h-full`}>
          <img
            className="w-full h-full object-contain"
            src={biznestLogo}
            alt="logo"
          />
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-500 text-xl"
        >
          {isSidebarOpen ? <GiHamburgerMenu /> : <IoIosArrowForward />}
        </button>
      </div>

      <div
        className={`${
          isSidebarOpen ? "w-60" : "w-20"
        } bg-white  text-black flex flex-shrink-0 h-screen overflow-y-auto transition-all duration-100 z-[1]`}
      >
        <div className="flex relative w-full">
          <div className="p-1 flex flex-col gap-2 w-full">

            <div className="rounded-md">
              {defaultModules.map((module, index) => (
                <div key={index} className="border-b">
                  <div
                    className={`cursor-pointer bg-[#E7ECEE]  flex justify-center items-center p-4 hover:wono-blue-dark hover:text-white hover:rounded-md ${
                      isActive(module.route)
                        ? "wono-blue border-r-4 transition-all duration-100 border-[#0DB4EA] rounded-tl-md rounded-bl-md text-[#0DB4EA]"
                        : "bg-white"
                    }`}
                    onClick={() => {
                      module.submenus && toggleModule(index);
                    }}
                  >
                    <div className="flex justify-center text-sm w-8">{module.icon}</div>
                    {isSidebarOpen && (
                      <span className="pl-5 text-sm">{module.title}</span>
                    )}
                    {isSidebarOpen && module.submenus && (
                      <span
                        className={`ml-auto transition-transform duration-300 ease-in-out ${
                          expandedModule === index ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        {expandedModule === index ? (
                          <FaChevronUp />
                        ) : (
                          <FaAngleDown />
                        )}
                      </span>
                    )}
                  </div>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      expandedModule === index ? "max-h-[500px]" : "max-h-0"
                    }`}
                  >
                    {module.submenus && (
                      <div>
                        {module.submenus.map((submenu, idx) => (
                          <div
                            key={idx}
                            className={`cursor-pointer bg-[#E7ECEE] p-4 hover:wono-blue-dark hover:text-white hover:rounded-md ${
                              isActive(submenu.route)
                                ? "wono-blue border-r-4 border-[#0DB4EA] rounded-tl-md rounded-bl-md text-[#0DB4EA]"
                                : "bg-white border-b-[1px] border-gray-200"
                            } `}
                            onClick={() => navigate(submenu.route)}
                          >
                            <div
                              className={`flex items-center ${
                                isSidebarOpen
                                  ? "justify-start pl-2"
                                  : "justify-center"
                              }`}
                            >
                              <div
                                className={`${
                                  isSidebarOpen ? "text-sm" : "text-sm"
                                }`}
                              >
                                {submenu.icon}
                              </div>
                              {isSidebarOpen && (
                                <span className="pl-4 text-sm">{submenu.title}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleMenuOpen(item)}
                className={`cursor-pointer flex ${
                  isSidebarOpen
                    ? "pl-[1rem] hover:wono-blue-dark hover:rounded-md hover:text-white"
                    : "justify-center"
                } items-center border-b-[1px] py-3 ${
                  location.pathname === item.route
                    ? "wono-blue border-r-4 border-b-[0px]  border-[#0DB4EA] rounded-tl-md rounded-bl-md text-[#0DB4EA]"
                    : "bg-white"
                } `}
              >
                {/* <img src={item.icon} alt={item.name} className="w-8 h-6 mr-3" /> */}
                <div className="flex justify-center w-8 text-sm">
                  {item.icon}
                </div>
                {isSidebarOpen && (
                  <span className="pl-5 text-sm">{item.name}</span>
                )}
              </div>
            ))}

            <div
              onClick={() => {
                navigate("profile");
              }}
              className={`flex border-b-[1px] ${
                isSidebarOpen ? "pl-[1rem]" : "justify-center"
              } items-center cursor-pointer  py-4 hover:wono-blue-dark hover:text-white hover:rounded-md ${
                location.pathname === "/profile"
                  ? "wono-blue border-r-4 border-[#0DB4EA] rounded-tl-md rounded-bl-md text-[#0DB4EA]"
                  : "bg-white"
              }`}
            >
              <div className="flex justify-center w-8 text-sm">
                <FaUserTie  />
              </div>
              {isSidebarOpen && <span className="pl-5 text-sm">Profile</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
