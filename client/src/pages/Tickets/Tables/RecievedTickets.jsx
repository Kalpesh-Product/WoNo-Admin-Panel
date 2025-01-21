import React, { useEffect, useState } from "react";
import AgTable from "../../../components/AgTable";
import { Chip, ListItem } from "@mui/material";
import MuiModal from "../../../components/MuiModal";
import Button from "@mui/material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "sonner";

const RecievedTickets = ({ title,data }) => {
  const [open, setOpen] = useState(false);
  const axios = useAxiosPrivate()



  const openModal = () => {
    console.log("I am Clicked");
    setOpen(true);
  };

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
  const rows = transformTicketsData(data);

  const handleClose = () => setOpen(false);
  const handleAccept = async(ticket) =>{
    console.log("Ticket details : ", ticket)
    try {
      const response = await axios.post('/api/tickets/accept-ticket',{
        ticketId : ticket.id
      });
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error)
    }
    
  } 



  const assignees = [
    "AiwinRaj",
    "Anushri Bhagat",
    "Allen Silvera",
    "Sankalp Kalangutkar",
    "Muskan Dodmani",
  ];

  const viewChildren = (
    <>
      <ul>
        {assignees.map((key, items) => {
          return (
            <>
              <div className="flex flex-row gap-6">
                <input type="checkbox"></input>
                <li key={items}>{key}</li>
              </div>
            </>
          );
        })}
      </ul>
      <div className="flex items-center justify-center mb-4">
        <button className="p-2 bg-primary align-middle text-white rounded-md">
          Assign 
        </button>
      </div>
    </>
  );

  const recievedTicketsColumns = [
    { field: "raisedBy", headerName: "Raised By" },
    { field: "fromDepartment", headerName: "From Department" },
    { field: "ticketTitle", headerName: "Ticket Title", flex: 1 },

    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusColorMap = {
          Pending: { backgroundColor: "#FFECC5", color: "#CC8400" }, // Light orange bg, dark orange font
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
            onClick={(e) => handleAccept(params.data)}
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



  return (
    <div className="p-4 border-default border-borderGray rounded-md">
      <div className="pb-4">
        <span className="text-subtitle">{title}</span>
      </div>
      <div className="w-full">
        <AgTable key={rows.length} data={rows} columns={recievedTicketsColumns} />
      </div>
      <MuiModal
        open={open}
        onClose={handleClose}
        title="Assign Tickets"
        children={viewChildren}
        btnTitle="Assign"
        // Pass your desired background color
      >
        {/* <div className="flex items-center justify-center mb-10">
          <button className="p-4 bg-primary align-middle text-white rounded-md">
            Assign Ticket
          </button>
        </div> */}
      </MuiModal>
    </div>
  );
};

export default RecievedTickets;
