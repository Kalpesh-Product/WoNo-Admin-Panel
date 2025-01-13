import React from "react";
import AgTable from "../../../components/AgTable";
import { Chip } from "@mui/material";

const AcceptedTickets = ({ title }) => {
  const recievedTicketsColumns = [
    { field: "raisedBy", headerName: "Raised By" },
    {
      field: "selectedDepartment",
      headerName: "Selected Department",
      width: 100,
    },
    { field: "ticketTitle", headerName: "Ticket Title", flex: 1 },
    {
      field: "tickets",
      headerName: "Tickets",
      cellRenderer: (params) => {
        const statusColorMap = {
          "Assigned Ticket": { backgroundColor: "#ffbac2", color: "#ed0520" }, // Light orange bg, dark orange font
          "Accepted Ticket": { backgroundColor: "#90EE90", color: "#02730a" }, // Light green bg, dark green font
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
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusColorMap = {
          pending: { backgroundColor: "#FFECC5", color: "#CC8400" }, // Light orange bg, dark orange font
          completed: { backgroundColor: "#90EE90", color: "#006400" }, // Light green bg, dark green font
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
              Close
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
            >
              Support
            </button>
          </div>
        </>
      ),
    },
  ];

  const rows = [
    {
      raisedBy: "Abrar Shaikh",
      selectedDepartment: "IT",
      ticketTitle: "Monitor dead pixel",
      tickets: "Accepted Ticket",
      status: "pending",
    },
    {
      raisedBy: "John Doe",
      selectedDepartment: "HR",
      ticketTitle: "System login issue",
      tickets: "Accepted Ticket",
      status: "pending",
    },
    {
      raisedBy: "Jane Smith",
      selectedDepartment: "Finance",
      ticketTitle: "Printer not working",
      tickets: "Accepted Ticket",
      status: "pending",
    },
    {
      raisedBy: "Mike Brown",
      selectedDepartment: "Operations",
      ticketTitle: "Software installation request",
      tickets: "Assigned Ticket",
      status: "pending",
    },
    {
      raisedBy: "Emily Davis",
      selectedDepartment: "Marketing",
      ticketTitle: "Email access problem",
      tickets: "Accepted Ticket",
      status: "pending",
    },
    {
      raisedBy: "Chris Johnson",
      selectedDepartment: "Admin",
      ticketTitle: "Air conditioner maintenance",
      tickets: "Assigned Ticket",
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
    </div>
  );
};

export default AcceptedTickets;
