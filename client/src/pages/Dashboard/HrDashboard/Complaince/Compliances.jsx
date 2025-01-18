import { Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import ViewEmployees from "./ViewEmployees";

const Compliances = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <div className="p-4">
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
            color: "white",
          },
        }}
      >
        <Tab label="View Employees" />
        <Tab label="Company Handbook" />
        <Tab label="Holidays / Events" />
      </Tabs>

      <div className="py-4 bg-white">
        {activeTab === 0 && (
          <div className="">
          <ViewEmployees />
          </div>
        )}
        {activeTab === 1 && (
          <div>
           Company Handbook
          </div>
        )}
        {activeTab === 2 && (
          <div>
           Holidays / Events
          </div>
        )}
      </div>
    </div>
  );
};

export default Compliances;
