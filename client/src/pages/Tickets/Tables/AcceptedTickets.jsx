import AgTable from "../../../components/AgTable";
import { Chip, CircularProgress, LinearProgress, TextField, Typography } from "@mui/material";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../index";
import MuiModal from "../../../components/MuiModal";
import { Controller, useForm } from "react-hook-form";
import PrimaryButton from "../../../components/PrimaryButton";
import { useState } from "react";
import SecondaryButton from "../../../components/SecondaryButton";
import ThreeDotMenu from "../../../components/ThreeDotMenu";

const AcceptedTickets = ({ title }) => {
  const axios = useAxiosPrivate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reason: "",
    },
  });

  // Fetch Accepted Tickets
  const { data: acceptedTickets = [], isLoading } = useQuery({
    queryKey: ["accepted-tickets"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "/api/tickets/ticket-filter/accept-assign"
        );

        return response.data;
      } catch (error) {
        console.error("Error fetching tickets:", error);
        throw new Error("Failed to fetch tickets");
      }
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["close-ticket"],
    mutationFn: async (ticketId) => {
      const response = await axios.patch("/api/tickets/close-ticket", {
        ticketId,
      });
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Ticket closed successfully");
      queryClient.invalidateQueries({ queryKey: ["accepted-tickets"] }); // Refetch tickets
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to close ticket");
    },
  });

  const { mutate: getSupport, isPending: isGetSupportPending } = useMutation({
    mutationKey: ["get-support"],
    mutationFn: async (data) => {
      const response = await axios.post(`/api/tickets/support-ticket`, data);
      return response.data;
    },
    onSuccess: function (data) {
      toast.success(data.message || "Support ticket created successfully");
      queryClient.invalidateQueries({ queryKey: ["accepted-tickets"] });
      reset();
      setOpenModal(false);
    },
    onError: function (error) {
      toast.error(
        error.response.data.message || "Failed to create support ticket"
      );
    },
  });

  const handleSupportTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    setOpenModal(true);
  };
  const onSubmit = (data) => {
    if (!selectedTicketId) return;
    getSupport({ ticketId: selectedTicketId, reason: data.reason });
  };

  const recievedTicketsColumns = [
    { field: "raisedBy", headerName: "Raised By" },
    {
      field: "raisedToDepartment",
      headerName: "Selected Department",
      width: 100,
    },
    { field: "ticketTitle", headerName: "Ticket Title", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusColorMap = {
          "In Progress": { backgroundColor: "#FFECC5", color: "#CC8400" },
          Closed: { backgroundColor: "#90EE90", color: "#02730a" },
        };

        const { backgroundColor, color } = statusColorMap[params.value] || {
          backgroundColor: "gray",
          color: "white",
        };
        return <Chip label={params.value} style={{ backgroundColor, color }} />;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => (
        <div className="flex gap-2">
          <ThreeDotMenu
            rowId={params.data.id}
            menuItems={[
              { label: "Close", onClick: () => mutate(params.data.id) },
              {
                label: "Support",
                onClick: () => handleSupportTicket(params.data.id),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 border-default border-borderGray rounded-md">
      <div className="pb-4">
        <Typography variant="h6">{title}</Typography>
      </div>
      <div className="w-full">
        {isLoading && (
          <div className="flex justify-center">
            <LinearProgress color="black" />
          </div>
        )}
        {!isLoading ? (
          <AgTable
            key={acceptedTickets.length}
            data={[
              ...acceptedTickets.map((ticket) => ({
                id: ticket._id,
                raisedBy: ticket.raisedBy?.firstName || "Unknown",
                raisedToDepartment:
                  ticket.raisedBy.departments.map((dept) => dept.name) || "N/A",
                ticketTitle: ticket?.ticket || "No Title",
                status: ticket.status || "Pending",
              })),
            ]}
            columns={recievedTicketsColumns}
          />
        ) : null}
      </div>

      <MuiModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={"Support Ticket"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="reason"
            control={control}
            rules={{ required: "Reason is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label={"Reason"}
                multiline
                rows={5}
                error={!!errors.reason}
                helperText={errors.reason?.message}
              />
            )}
          />
          <PrimaryButton
            title={"Submit"}
            isLoading={isGetSupportPending}
            disabled={isGetSupportPending}
            type={"submit"}
          />
        </form>
      </MuiModal>
    </div>
  );
};

export default AcceptedTickets;
