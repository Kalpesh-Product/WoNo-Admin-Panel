import React, { useEffect, useState } from "react";
import AgTable from "../../../components/AgTable";
import { Chip } from "@mui/material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "sonner";

const AcceptedTickets = ({ title }) => {
  const [acceptedTickets, setAcceptedTickets] = useState([]);
  
  const axios = useAxiosPrivate();

  useEffect(() => {
    const getAcceptedTickets = async () => {
      try {
        const response = await axios.get(
          "/api/tickets/filtered-tickets/accept"
        );
        setAcceptedTickets(response.data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    getAcceptedTickets();
  }, []);

  const handleClose = async (closedTicket) => {
    try {
      const response = await axios.post("/api/tickets/close-ticket", {
        ticketId: closedTicket.id,
      });
      toast.success(response.data.message);
  
      // Update the state to remove the closed ticket
      setAcceptedTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket._id !== closedTicket.id)
      );
    } catch (error) {
      toast.error(error.message);
    }
  };
  

  useEffect(() => {
    console.log("Accepted tickets : ", acceptedTickets);
  }, [acceptedTickets]);

  const recievedTicketsColumns = [
    { field: "raisedBy", headerName: "Raised By" },
    {
      field: "raisedToDepartment",
      headerName: "Selected Department",
      width: 100,
    },
    { field: "ticketTitle", headerName: "Ticket Title", flex: 1 },
    // {
    //   field: "tickets",
    //   headerName: "Tickets",
    //   cellRenderer: (params) => {
    //     const statusColorMap = {
    //       "Assigned Ticket": { backgroundColor: "#ffbac2", color: "#ed0520" }, 
    //       "Accepted Ticket": { backgroundColor: "#90EE90", color: "#02730a" },
    //     };

    //     const { backgroundColor, color } = statusColorMap[params.value] || {
    //       backgroundColor: "gray",
    //       color: "white",
    //     };
    //     return (
    //       <>
    //         <Chip
    //           label={params.value}
    //           style={{
    //             backgroundColor,
    //             color,
    //           }}
    //         />
    //       </>
    //     );
    //   },
    // },
    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusColorMap = {
          "In Progress": { backgroundColor: "#FFECC5", color: "#CC8400" }, // Light orange bg, dark orange font
          Closed: { backgroundColor: "#90EE90", color: "#02730a" }, // Light green bg, dark green font
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
              onClick={(e) => handleClose(params.data)}
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

  const transformTicketsData = (tickets) => {
    return tickets.map((ticket) => ({
      id: ticket._id,
      raisedBy: ticket.raisedBy?.name || "Unknown",
      raisedToDepartment: ticket.raisedToDepartment.name || "N/A",
      ticketTitle: ticket.ticket?.title || "No Title",
      status: ticket.status || "Pending",
    }));
  };

  // Example usage
  const rows = transformTicketsData(acceptedTickets);


  return (
    <div className="p-4 border-default border-borderGray rounded-md">
      <div className="pb-4">
        <span className="text-subtitle">{title}</span>
      </div>
      <div className="w-full">
        <AgTable
          key={rows.length}
          data={rows}
          columns={recievedTicketsColumns}
        />
      </div>
    </div>
  );
};

export default AcceptedTickets;
