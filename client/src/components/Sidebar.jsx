import React, { useState } from "react";
import { FaAngleDown, FaChevronUp, FaUsers } from "react-icons/fa6";
import { FaProjectDiagram, FaRegCalendarAlt, FaTasks } from "react-icons/fa";
import { TbReportSearch } from "react-icons/tb";
import { IoIosArrowForward, IoMdNotifications } from "react-icons/io";
import { SiAuthelia } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { RiDashboardLine } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SideBarContext";
import { GiHamburgerMenu } from "react-icons/gi";
import biznestLogo from "../assets/biznest/biznest_logo.jpg";

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedDepartment, setExpandedDepartment] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  // Menu items array (without DASHBOARD)
  const menuItems = [
    {
      name: "Reports",
      icon: <TbReportSearch />,
      route: "/reports",
    },

    { name: "Calendar", icon: <FaRegCalendarAlt />, route: "/calendar" },
    { name: "Chat", icon: <HiOutlineChatAlt2 />, route: "/chat" },
    { name: "Access", icon: <SiAuthelia />, route: "/access" },
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
      icon: <FaTasks />,
      title: "Dashboard",
      submenus: [
        {
          id: 2,
          title: "Frontend Dashboard",
          icon: <FaProjectDiagram />,
        },
        {
          id: 3,
          title: "HR Dashboard",
          icon: <FaTasks />,
        },
        {
          id: 4,
          title: "Finance Dashboard",
          icon: <FaUsers />,
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
    <div className={`flex flex-col h-screen bg-gray`}>
      <div className={`w-full flex ${isSidebarOpen ? "justify-between p-3" : 'justify-center p-6'} items-center`}>
        <div className={`${isSidebarOpen ? 'w-40' : 'hidden' } object-contain`}>
            <img src={biznestLogo} alt="logo" />
        </div>
 
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2"
      >
        {isSidebarOpen ? <GiHamburgerMenu /> : <IoIosArrowForward />}
      </button>
      </div>

      <div
        className={`${
          isSidebarOpen ? "w-60" : "w-20"
        } bg-white border-2  text-black flex flex-shrink-0 h-screen overflow-y-auto transition-all duration-300 z-[1]`}
      >
        <div className="flex relative w-full">
          {/*Dashboard */}
          <div className="p-1 flex flex-col gap-0 w-full">
            <div
              onClick={() => {
                navigate("/dashboard");
              }}
              className={`flex border-b-[1px] ${
                isSidebarOpen ? "pl-[1rem]" : "justify-center"
              } items-center cursor-pointer  py-4 hover:wono-blue-dark hover:text-white hover:rounded-md ${
                location.pathname === "/dashboard"
                  ? "wono-blue border-r-4 border-[#0DB4EA] rounded-tl-md rounded-bl-md text-[#0DB4EA]"
                  : "bg-white"
              }`}
            >
              <div className="flex justify-center w-6 text-md">
                <RiDashboardLine />
              </div>
              {isSidebarOpen && <span className="pl-5 text-md">Dashboard</span>}
            </div>
            <div>
              {defaultModules.map((module, index) => (
                <div key={index} className="border-b">
                  <div
                    className={`cursor-pointer flex justify-center items-center py-4 px-4 hover:wono-blue-dark hover:text-white hover:rounded-md ${
                      isActive(module.route)
                        ? "wono-blue border-r-4 border-[#0DB4EA] rounded-tl-md rounded-bl-md text-[#0DB4EA]"
                        : "bg-white border-b-[1px] border-gray-200"
                    }`}
                    onClick={() => {
                      module.submenus && toggleModule(index);
                      navigate(module.route);
                    }}
                  >
                    <div className="text-md">{module.icon}</div>
                    {isSidebarOpen && (
                      <span className="pl-5 text-md">{module.title}</span>
                    )}
                    {isSidebarOpen && module.submenus && (
                      <span className="ml-auto">
                        {expandedModule === index ? (
                          <FaChevronUp />
                        ) : (
                          <FaAngleDown />
                        )}
                      </span>
                    )}
                  </div>
                  {expandedModule === index && module.submenus && (
                    <div className="pl-4">
                      {module.submenus.map((submenu, idx) => (
                        <div
                          key={idx}
                          className={`cursor-pointer py-4 hover:wono-blue-dark hover:text-white hover:rounded-md ${
                            isActive(submenu.route)
                              ? "wono-blue border-r-4 border-[#0DB4EA] rounded-tl-md rounded-bl-md text-[#0DB4EA]"
                              : "bg-white border-b-[1px] border-gray-200"
                          } `}
                          onClick={() => navigate(submenu.route)}
                        >
                          <div
                            className={`flex items-center ${
                              isSidebarOpen
                                ? "justify-start pl-4"
                                : "justify-center"
                            }`}
                          >
                            <div
                              className={`${
                                isSidebarOpen ? "text-md" : "text-md"
                              }`}
                            >
                              {submenu.icon}
                            </div>
                            {isSidebarOpen && (
                              <span className="pl-4">{submenu.title}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                } items-center border-b-[1px] py-4 ${
                  location.pathname === item.route
                    ? "wono-blue border-r-4 border-b-[0px]  border-[#0DB4EA] rounded-tl-md rounded-bl-md text-[#0DB4EA]"
                    : "bg-white"
                } `}
              >
                {/* <img src={item.icon} alt={item.name} className="w-6 h-6 mr-3" /> */}
                <div className="flex justify-center w-6 text-md">
                  {item.icon}
                </div>
                {isSidebarOpen && (
                  <span className="pl-5 text-md">{item.name}</span>
                )}
              </div>
            ))}

            <div
              onClick={() => {
                navigate("/profile");
              }}
              className={`flex border-b-[1px] ${
                isSidebarOpen ? "pl-[1rem]" : "justify-center"
              } items-center cursor-pointer  py-4 hover:wono-blue-dark hover:text-white hover:rounded-md ${
                location.pathname === "/profile"
                  ? "wono-blue border-r-4 border-[#0DB4EA] rounded-tl-md rounded-bl-md text-[#0DB4EA]"
                  : "bg-white"
              }`}
            >
              <div className="flex justify-center w-6 text-md">
                <CgProfile />
              </div>
              {isSidebarOpen && <span className="pl-5 text-md">Profile</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
