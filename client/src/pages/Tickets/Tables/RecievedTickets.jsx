import React, { useState } from "react";
import AgTable from "../../../components/AgTable";
import { Chip, CircularProgress } from "@mui/material";
import MuiModal from "../../../components/MuiModal";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "sonner";
import PrimaryButton from "../../../components/PrimaryButton";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../index";
import ThreeDotMenu from "../../../components/ThreeDotMenu";

const RecievedTickets = ({ title }) => {
  const [open, setOpen] = useState(false);
  const axios = useAxiosPrivate();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/tickets/get-tickets");
        const filteredTickets = response.data.filter(
          (ticket) => !ticket.accepted
        );
        return filteredTickets;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });

  const { mutate: acceptMutate } = useMutation({
    mutationKey: ["accept-ticket"],
    mutationFn: async (ticket) => {
      console.log("ticket is : ", ticket);
      const response = await axios.post(
        `/api/tickets/accept-ticket/${ticket.id}`
      );

      return response.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success(data);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });
  const { mutate: rejectMutate, isPending : rejectPending } = useMutation({
    mutationKey: ["reject-ticket"],
    mutationFn: async (ticket) => {
      const response = await axios.post(
        `/api/tickets/reject-ticket/${ticket.id}`
      );

      return response.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success(data);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const { mutate: assignMutate } = useMutation({
    mutationKey: ["assign-ticket"],
    mutationFn: async (ticket) => {
      const response = await axios.post("/api/tickets/assign-ticket", {
        ticketId: ticket.id,
      });

      return response.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success(data);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const openModal = () => {
    ("I am Clicked");
    setOpen(true);
  };

  const transformTicketsData = (tickets) => {
    return tickets.map((ticket) => ({
      id: ticket._id,
      raisedBy: ticket.raisedBy?.firstName || "Unknown",
      fromDepartment:
        ticket.raisedBy.departments.map((dept) => dept.name) || "N/A",
      ticketTitle: ticket?.ticket || "No Title",
      status: ticket.status || "Pending",
    }));
  };

  // Example usage
  const rows = isLoading ? [] : transformTicketsData(tickets);

  const handleClose = () => setOpen(false);

  const assignees = [
    "AiwinRaj",
    "Anushri Bhagat",
    "Allen Silvera",
    "Sankalp Kalangutkar",
    "Muskan Dodmani",
  ];

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
          <ThreeDotMenu
            rowId={params.data.id}
            menuItems={[
              { label: "Accept", onClick: () => acceptMutate(params.data) },
              { label: "Assign", onClick: openModal },
              { label: "Reject", onClick: ()=> rejectMutate(params.data) },
            ]}
          />
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
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <CircularProgress color="black" />
          </div>
        ) : (
          <AgTable
            key={rows.length}
            data={rows}
            tableHeight={350}
            columns={recievedTicketsColumns}
          />
        )}
      </div>
      <MuiModal open={open} onClose={handleClose} title="Assign Tickets">
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
            <PrimaryButton title={"Assign"} />
          </div>
        </>
      </MuiModal>
    </div>
  );
};

export default RecievedTickets;
