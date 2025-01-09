import { Avatar, Chip } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

const AccessProfile = () => {
  const location = useLocation();
  const { user } = location.state || {}; // Retrieve the user object from state

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="bg-white p-4">
      <div className="flex items-center gap-8 w-full border-2 border-gray-200 p-4 rounded-md">
        <div className="flex gap-6 items-center">
          <div className="w-40 h-40">
            <Avatar
              style={{
                backgroundColor: user.avatarColor,
                width: "100%",
                height: "100%",
                fontSize: "5rem",
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-title flex items-center gap-3">
              {user.name}{" "}
              <Chip
                label={user.status}
                sx={{
                  backgroundColor: user.status === "Active" ? "green" : "grey",
                  color: "white",
                }}
              />
            </span>
            <span className="text-subtitle">
              {user.role} - {user.department}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          
            <div className="flex justify-between ">
              <div className="flex flex-col gap-4 justify-start flex-1 text-gray-600">
                <span className=" capitalize">User Name</span>
                <span className=" capitalize">Email</span>
                <span className=" capitalize">Role</span>
                <span className=" capitalize">User Since</span>
                <span className=" capitalize">Status</span>
              </div>
              <div className="flex flex-col gap-4 justify-start flex-1 text-gray-500">
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>{user.role}</span>
                <span>{user.userSince}</span>
                <span>{user.status}</span>
              </div>
            </div>
          
        </div>
      </div>
    </div>
  );
};

export default AccessProfile;
