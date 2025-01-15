// MuiModal.js
import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import { IoMdClose } from "react-icons/io";

const MuiModal = ({ open, onClose, title, children, headerBackground }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40%",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          outline:'none'
        }}
      >
        <div className="flex justify-between items-center px-4 py-2  z-[-1] rounded-t-md"  style={{backgroundColor : headerBackground ? headerBackground : 'white', color:headerBackground?'white' : 'black'}}>
          <div className="text-subtitle">{title}</div>
          <IconButton  sx={{ p: 0 }} onClick={onClose}>
            <IoMdClose  className="text-white"/>
          </IconButton>
        </div>
        <div className="p-4">{children}</div>
      </Box>
    </Modal>
  );
};

export default MuiModal;
