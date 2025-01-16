import React from "react";
import { Drawer } from "@mui/material";

const MuiAside = ({ open, onClose, children, title }) => {
  return (
    
    <Drawer anchor="right" open={open} onClose={onClose}>
        <div className="px-4 py-2  bg-primary text-white">
            <span className="text-subtitle">{title}</span>
        </div>
      <div className="bg-[#F7FAFF] h-screen" style={{ width: "300px", padding: "16px" }}>{children}</div>
    </Drawer>
  );
};

export default MuiAside;
