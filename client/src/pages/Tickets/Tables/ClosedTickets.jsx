import React, { useEffect, useState } from "react";
import AgTable from "../../../components/AgTable";
import { Chip } from "@mui/material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const ClosedTickets = ({title}) => {
  const axios = useAxiosPrivate();
  const [closedTickets, setClosedTickets] = useState([])

  useEffect(()=>{
    const fetchClosedTickets = async()=>{
      try {
        const response = await axios.get('/api/tickets/filtered-tickets/close');
        setClosedTickets(response.data)
      } catch (error) {
        console.log(error.message)
      }
     
    }

    fetchClosedTickets()
  },[])

    useEffect(() => {
      console.log("Closed tickets : ", closedTickets);
    }, [closedTickets]);

  const transformTicketsData = (tickets) => {
    return tickets.map((ticket) => ({
      id: ticket._id,
      raisedBy: ticket.raisedBy?.name || "Unknown",
      fromDepartment: ticket.raisedToDepartment.name || "N/A",
      ticketTitle: ticket.ticket?.title || "No Title",
      status: ticket.status || "Pending",
    }));
  };
  
  // Example usage
  const rows = transformTicketsData(closedTickets);
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
          Closed: { backgroundColor: "#cce7fc", color: "#259bf5" },
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

  // const rows = [
  //   {
  //     raisedBy: "Abrar Shaikh",
  //     fromDepartment: "IT",
  //     ticketTitle: "Monitor dead pixel",
  //     status: "Closed",
  //   },
  //   {
  //     raisedBy: "John Doe",
  //     fromDepartment: "HR",
  //     ticketTitle: "System login issue",
  //     status: "Closed",
  //   },
  //   {
  //     raisedBy: "Jane Smith",
  //     fromDepartment: "Finance",
  //     ticketTitle: "Printer not working",
  //     status: "Closed",
  //   },
  //   {
  //     raisedBy: "Mike Brown",
  //     fromDepartment: "Operations",
  //     ticketTitle: "Software installation request",
  //     status: "Closed",
  //   },
  //   {
  //     raisedBy: "Emily Davis",
  //     fromDepartment: "Marketing",
  //     ticketTitle: "Email access problem",
  //     status: "Closed",
  //   },
  //   {
  //     raisedBy: "Chris Johnson",
  //     fromDepartment: "Admin",
  //     ticketTitle: "Air conditioner maintenance",
  //     status: "Closed",
  //   },
  // ];
  return (
    <div className="p-4 border-default border-borderGray rounded-md">
      <div className="pb-4">
        <span className="text-subtitle">{title}</span>
      </div>
      <div className="w-full">
        <AgTable key={rows.length} data={rows} columns={recievedTicketsColumns} />
      </div>
    </div>
  );
};

export default ClosedTickets;
