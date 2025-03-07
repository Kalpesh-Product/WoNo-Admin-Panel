import React, { useState } from "react";
import {
  TextField,
  Avatar,
  InputAdornment,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  IoIosArrowForward,
  IoIosSearch,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { MdOutlineMailOutline } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserTie } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useSidebar } from "../context/SideBarContext";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import biznestLogo from "../assets/biznest/biznest_logo.jpg";
import Abrar from "../assets/abrar.jpeg";

const Header = () => {
  const axios = useAxiosPrivate();
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const logout = useLogout();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // State for Popover
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: companyLogo } = useQuery({
    queryKey: ["companyLogo"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/company/get-company-logo");
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await logout();
  };

  const handleProfileClick = () => {
    navigate("/app/profile");
    handlePopoverClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "avatar-popover" : undefined;

  return (
    <>
      <div className="flex w-full justify-between gap-x-10 items-center p-2">
        {!isMobile && (
          <div className="w-48 flex items-center gap-16 h-full pl-4">
            <img
              onClick={() => navigate("dashboard/frontend-dashboard")}
              className="w-[100%] h-full object-contain cursor-pointer"
              src={companyLogo?.logoUrl || biznestLogo}
              alt="logo"
            />
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 text-xl"
            >
              {isSidebarOpen ? <GiHamburgerMenu /> : <IoIosArrowForward />}
            </button>
          </div>
        )}

        {!isMobile && (
          <div className="w-full flex items-center pl-20">
            <TextField
              fullWidth
              size="small"
              type="search"
              placeholder="Type here to search..."
              variant="standard"
              slotProps={{
                input: {
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoIosSearch size={20} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
        )}

        {!isMobile && (
          <div className="flex w-full justify-end gap-4">
            <button className="bg-[#1E3D73] p-2 text-white rounded-md">
              <IoMdNotificationsOutline />
            </button>
            <button className="bg-[#1E3D73] p-2 text-white rounded-md">
              <MdOutlineMailOutline />
            </button>
          </div>
        )}

        {isMobile && (
          <div className="w-1">

          </div>
        )}  

        {/* Avatar Section */}
        <div className="flex items-center">
          <IconButton onClick={handleAvatarClick}>
            <Avatar className="cursor-pointer">
              {auth.user.name === "Abrar Shaikh" ? (
                <img src={Abrar} alt="" />
              ) : (
                auth.user.firstName.charAt(0)
              )}
            </Avatar>
          </IconButton>
        </div>
      </div>

      {/* Popover for Mobile View */}
      {isMobile && (
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div className="p-4 w-64">
            <List>
              <ListItem>
                <TextField
                  fullWidth
                  size="small"
                  type="search"
                  placeholder="Search..."
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <IoIosSearch size={20} />
                      </InputAdornment>
                    ),
                  }}
                />
              </ListItem>
              <Divider />
              <ListItem button className="hover:text-primary transition-all">
                <IoMdNotificationsOutline className="mr-2" />
                <ListItemText primary="Notifications" />
              </ListItem>
              <ListItem button className="hover:text-primary transition-all">
                <MdOutlineMailOutline className="mr-2" />
                <ListItemText primary="Messages" />
              </ListItem>
              <Divider />
              <ListItem button onClick={handleProfileClick}>
                <ListItemIcon>
                  <FaUserTie />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button onClick={handleSignOut} className="hover:text-red-600">
                <ListItemIcon>
                  <FiLogOut />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItem>
            </List>
          </div>
        </Popover>
      )}
    </>
  );
};

export default Header;
