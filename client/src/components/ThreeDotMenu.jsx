import { Popover, IconButton, Button } from "@mui/material";
import { useState } from "react";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import PrimaryButton from "./PrimaryButton";

const ThreeDotMenu = ({ rowId, menuItems }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {/* Three-dot menu button */}
      <IconButton onClick={handleOpen}>
        <PiDotsThreeVerticalBold />
      </IconButton>

      {/* Popover Dropdown */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <div className="w-full bg-white rounded-md motion-preset-slide-down-sm">
          {menuItems.map(({ label, onClick }, index) => (
            <div
              key={index}
              onClick={() => {
                onClick();
                handleClose(); // Close popover after clicking an option
              }}
              className="bg-white text-primary p-4 py-2 border-b-[1px] border-borderGray cursor-pointer text-content hover:bg-gray-200"
            >
              {label}
            </div>
          ))}
        </div>
      </Popover>
    </div>
  );
};

export default ThreeDotMenu;
