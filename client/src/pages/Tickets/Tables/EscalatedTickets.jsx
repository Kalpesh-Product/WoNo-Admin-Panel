import React from "react";
import AgTable from "../../../components/AgTable";
import { Chip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const EscalatedTickets = ({title}) => {

  const axios = useAxiosPrivate();

   // Fetch Supported Tickets
   const { data: escalatedTickets = [], isLoading } = useQuery({
    queryKey: ["esccalate-tickets"],
    queryFn: async () => {
      const response = await axios.get("/api/tickets?flag=escalate");

      return response.data;
    },
  });

   // Transform Tickets Data
   const transformTicketsData = (tickets) => {
    
    return !tickets.length
      ? []
      : tickets.map((ticket,index) => {

        const escalatedTicket = {
          srno: index + 1,
          raisedBy: ticket.raisedBy?.firstName || "Unknown",
          selectedDepartment: ticket.raisedBy?.departments.map((dept) => dept.name) || "N/A",
          ticketTitle: ticket?.ticket || "No Title",
          tickets: ticket?.assignees.length > 0 ? "Ticket Assigned": ticket?.acceptedBy ? "Ticket Accepted": "N/A",
          status: ticket.status || "Pending",
        }

        return escalatedTicket
      });
  };

  const rows = isLoading ? [] : transformTicketsData(escalatedTickets);


  const recievedTicketsColumns = [
    { field:"srno",headerName:"SR NO"},
    { field: "raisedBy", headerName: "Raised By" },
    { field: "selectedDepartment", headerName: "Selected Department", width:100 },
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
          Pending: { backgroundColor: "#FFECC5", color: "#CC8400" }, // Light orange bg, dark orange font
          "In Progress": { backgroundColor: "#ADD8E6", color: "#00008B" }, // Light blue bg, dark blue font
          Closed: { backgroundColor: "#90EE90", color: "#006400" }, // Light green bg, dark green font
          Open: { backgroundColor: "#E6E6FA", color: "#4B0082" }, // Light purple bg, dark purple font
          Completed: { backgroundColor: "#D3D3D3", color: "#696969" }, // Light gray bg, dark gray font
        }; 

        const { backgroundColor, color } = statusColorMap[params.value] || {
          backgroundColor: "gray",
          color: "white",
        };
        return (
          <div className="flex flex-col justify-center pt-4">
            <Chip
              label={params.value}
              style={{
                backgroundColor,
                color,
              }}
            />
            <span className="text-small text-borderGray text-center h-full">
              By ABC
            </span>
          </div>
        );
      },
    },
    {
      field: "escalatedTo",
      headerName: "Escalated To",
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
              Admin Department
            </button>
          </div>
        </>
      ),
    },
  ];

  // const rows = [
  //   {
  //     srno:"1",
  //     raisedBy: "Abrar Shaikh",
  //     selectedDepartment: "IT",
  //     ticketTitle: "Monitor dead pixel",
  //     tickets: "Accepted Ticket",
  //     status: "pending",
  //   },
  //   {
  //     srno:"2",
  //     raisedBy: "John Doe",
  //     selectedDepartment: "HR",
  //     ticketTitle: "System login issue",
  //     tickets: "Accepted Ticket",
  //     status: "pending",
  //   },
  //   {
  //     srno:"3",
  //     raisedBy: "Jane Smith",
  //     selectedDepartment: "Finance",
  //     ticketTitle: "Printer not working",
  //     tickets: "Accepted Ticket",
  //     status: "pending",
  //   },
  //   {
  //     srno:"4",
  //     raisedBy: "Mike Brown",
  //     selectedDepartment: "Operations",
  //     ticketTitle: "Software installation request",
  //     tickets: "Assigned Ticket",
  //     status: "pending",
  //   },
  //   {
  //     srno:"5",
  //     raisedBy: "Emily Davis",
  //     selectedDepartment: "Marketing",
  //     ticketTitle: "Email access problem",
  //     tickets: "Accepted Ticket",
  //     status: "pending",
  //   },
  //   {
  //     srno:"6",
  //     raisedBy: "Chris Johnson",
  //     selectedDepartment: "Admin",
  //     ticketTitle: "Air conditioner maintenance",
  //     tickets: "Assigned Ticket",
  //     status: "pending",
  //   },
  // ];
  
  
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

export default EscalatedTickets;
