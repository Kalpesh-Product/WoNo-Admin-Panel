import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import MyProfile from "./MyProfile";
import PrimaryButton from "../../components/PrimaryButton";
import MyAssets from "./MyAssets";

const Profile = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="w-full rounded-md bg-white p-4">
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          border: "1px solid #d1d5db",
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: "medium",
            padding: "12px 16px",
            borderRight: "0.1px solid #d1d5db",
          },
          "& .Mui-selected": {
            backgroundColor: "#1E3D73", // Highlight background color for the active tab
            color: "#ffff",
          },
        }}
      >
        <Tab label="My Profile" />
        <Tab label="Change Password" />
        <Tab label="Access Grant" />
        <Tab label="My Assets" />
        <Tab label="Meetings" />
        <Tab label="Tickets History" />
      </Tabs>

      <div className="py-4 bg-white">
        {activeTab === 0 && (
          <div className="h-[65vh] overflow-y-auto">
            <MyProfile pageTitle={"Profile Settings"}/>
          </div>
        )}
        {activeTab === 1 && <div>
          
          </div>}
        {activeTab === 2 && <div>Activity Content</div>}
        {activeTab === 3 && <div className="h-[65vh] overflow-y-auto">
            <MyAssets />
          </div>}
      </div>
    </div>
  );
};

export default Profile;
