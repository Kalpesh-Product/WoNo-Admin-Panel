import React, { useState } from "react";
import AgTable from "../../../components/AgTable";
import { Chip } from "@mui/material";
import MuiModal from "../../../components/MuiModal";
import Button from "@mui/material";

const RecievedTickets = ({ title }) => {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    console.log("I am Clicked");
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const viewChildren = (
    <>
      <ul>
        <li>Anushri Bhagat</li>
        <li>Aiwin</li>
        <li>Sankalp Kalangutkar</li>
        <li>Allen Silvera</li>
      </ul>
    </>
  );

  const viewChildrens = () => {
    return (
      <>
        
        <ul>
          <li>Anushri Bhagat</li>
          <li>Aiwin</li>
          <li>Sankalp Kalangutkar</li>
          <li>Allen Silvera</li>
        </ul>
      </>
    );
  };

  const recievedTicketsColumns = [
    { field: "raisedBy", headerName: "Raised By" },
    { field: "fromDepartment", headerName: "From Department" },
    { field: "ticketTitle", headerName: "Ticket Title", flex: 1 },

    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusColorMap = {
          pending: { backgroundColor: "#FFECC5", color: "#CC8400" }, // Light orange bg, dark orange font
          "in-progress": { backgroundColor: "#ADD8E6", color: "#00008B" }, // Light blue bg, dark blue font
          resolved: { backgroundColor: "#90EE90", color: "#006400" }, // Light green bg, dark green font
          open: { backgroundColor: "#E6E6FA", color: "#4B0082" }, // Light purple bg, dark purple font
          completed: { backgroundColor: "#D3D3D3", color: "#696969" }, // Light gray bg, dark gray font
        };

        const { backgroundColor, color } = statusColorMap[params.value] || {
          backgroundColor: "gray",
          color: "white",
        };
        return (
          <>
            <Chip
              label={params.value}
              style={{
                backgroundColor,
                color,
              }}
            />
          </>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => (
        <>
          <div className="p-2 mb-2 flex gap-2">
            <button
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "0.1rem 0.5rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Accept
            </button>
            <button
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "0.1rem 0.5rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={openModal}
            >
              Assign
            </button>
          </div>
        </>
      ),
    },
  ];

  const rows = [
    {
      raisedBy: "Abrar Shaikh",
      fromDepartment: "IT",
      ticketTitle: "Monitor dead pixel",
      status: "pending",
    },
    {
      raisedBy: "John Doe",
      fromDepartment: "HR",
      ticketTitle: "System login issue",
      status: "pending",
    },
    {
      raisedBy: "Jane Smith",
      fromDepartment: "Finance",
      ticketTitle: "Printer not working",
      status: "pending",
    },
    {
      raisedBy: "Mike Brown",
      fromDepartment: "Operations",
      ticketTitle: "Software installation request",
      status: "pending",
    },
    {
      raisedBy: "Emily Davis",
      fromDepartment: "Marketing",
      ticketTitle: "Email access problem",
      status: "pending",
    },
    {
      raisedBy: "Chris Johnson",
      fromDepartment: "Admin",
      ticketTitle: "Air conditioner maintenance",
      status: "pending",
    },
  ];

  return (
    <div className="p-4 border-default border-borderGray rounded-md">
      <div className="pb-4">
        <span className="text-subtitle">{title}</span>
      </div>
      <div className="w-full">
        <AgTable data={rows} columns={recievedTicketsColumns} />
      </div>
      <MuiModal
        open={open}
        onClose={handleClose}
        title="Assign Tickets"
        children={viewChildrens()}
        btnTitle="Assign"
        // Pass your desired background color
      ></MuiModal>
    </div>
  );
};

export default RecievedTickets;
