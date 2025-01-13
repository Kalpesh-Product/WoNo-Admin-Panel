import React from "react";
import AgTable from "../../../components/AgTable";
import { Chip } from "@mui/material";

const ClosedTickets = ({title}) => {
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
          completed: { backgroundColor: "#cce7fc", color: "#259bf5" },
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
  ];

  const rows = [
    {
      raisedBy: "Abrar Shaikh",
      fromDepartment: "IT",
      ticketTitle: "Monitor dead pixel",
      status: "completed",
    },
    {
      raisedBy: "John Doe",
      fromDepartment: "HR",
      ticketTitle: "System login issue",
      status: "completed",
    },
    {
      raisedBy: "Jane Smith",
      fromDepartment: "Finance",
      ticketTitle: "Printer not working",
      status: "completed",
    },
    {
      raisedBy: "Mike Brown",
      fromDepartment: "Operations",
      ticketTitle: "Software installation request",
      status: "completed",
    },
    {
      raisedBy: "Emily Davis",
      fromDepartment: "Marketing",
      ticketTitle: "Email access problem",
      status: "completed",
    },
    {
      raisedBy: "Chris Johnson",
      fromDepartment: "Admin",
      ticketTitle: "Air conditioner maintenance",
      status: "completed",
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

export default ClosedTickets;
