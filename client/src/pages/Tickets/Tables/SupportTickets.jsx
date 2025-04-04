import React, { useState } from "react";
import AgTable from "../../../components/AgTable";
import MuiModal from "../../../components/MuiModal";
import { Chip, CircularProgress } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ThreeDotMenu from "../../../components/ThreeDotMenu";
import { queryClient } from "../../..";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import PrimaryButton from "../../../components/PrimaryButton";

const SupportTickets = ({ title }) => {
  const [openModal, setopenModal] = useState(false);
  const axios = useAxiosPrivate();
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Fetch Supported Tickets
  const { data: supportedTickets = [], isLoading } = useQuery({
    queryKey: ["supported-tickets"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/tickets/ticket-filter/support");

        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
  const handleOpenAssignModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setopenModal(true);
  };

  // Transform Tickets Data
  const transformTicketsData = (tickets) => {
    console.log("TransformedTickets:", tickets);
    return !tickets.length
      ? []
      : tickets.map((ticket, index) => {
        const supportTicket = {
          id: ticket.ticket?._id,
          srno: index + 1,
          raisedBy:
            `${ticket.ticket.raisedBy?.firstName} ${ticket.ticket.raisedBy?.lastName}` ||
            "Unknown",
          selectedDepartment:
            [
              ...ticket.ticket.raisedBy.departments.map((dept) => dept.name),
            ] || "N/A",
          ticketTitle: ticket.reason || "No Title",
          tickets:
            ticket.ticket?.assignees.length > 0
              ? "Assigned Ticket"
              : ticket.ticket?.acceptedBy
                ? "Accepted Ticket"
                : "N/A",
          status: ticket.ticket.status || "Pending",
        };

        return supportTicket;
      });
  };

  const rows = isLoading ? [] : transformTicketsData(supportedTickets);

  const { mutate: closeTicket, isPending: isClosingTicket } = useMutation({
    mutationKey: ["close-ticket"],
    mutationFn: async (ticketId) => {
      const response = await axios.patch("/api/tickets/close-ticket", {
        ticketId,
      });
      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["supported-tickets"] }); // Refetch tickets
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to close ticket");
    },
  });

  const fetchSubOrdinates = async () => {
    try {
      const response = await axios.get("/api/users/assignees");

      return response.data;
    } catch (error) {
      toast.error(error.message || "Failed to fetch users");
    }
  };

  const { data: subOrdinates = [], isPending: isSubOrdinates } = useQuery({
    queryKey: ["sub-ordinates"],
    queryFn: fetchSubOrdinates,
  });

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      selectedEmployees: {},
    },
  });
  const { mutate: assignMutate } = useMutation({
    mutationKey: ["assign-ticket"],
    mutationFn: async (data) => {
      const response = await axios.patch(
        `/api/tickets/assign-ticket/${data.ticketId}`,
        {
          assignees: data.assignedEmployees,
        }
      );

      return response.data.message;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["supported-tickets"] });
      toast.success(data);
      setopenModal(false); // Close modal on success
      reset(); // Reset form after submission
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (formData) => {
    const assignedEmployeeIds = Object.keys(formData.selectedEmployees).filter(
      (id) => formData.selectedEmployees[id]
    ); // ✅ Keep only selected IDs

    if (assignedEmployeeIds.length === 0) {
      toast.error("Please select at least one employee.");
      return;
    }

    assignMutate({
      ticketId: selectedTicketId,
      assignedEmployees: assignedEmployeeIds,
    }); // ✅ Send array of IDs
  };

  const recievedTicketsColumns = [
    { field: "srno", headerName: "SR NO" },
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
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => (
        <>
          <ThreeDotMenu
            rowId={params.data.id}
            menuItems={[
              {
                label: "Close",
                onClick: () => closeTicket(params.data.id),
              },
              {
                label: "Re-Assign",
                onClick: () => handleOpenAssignModal(params.data.id),
              },
              {
                label: "Escalate",
                onClick: () => { }
              }
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
        {!isClosingTicket ? (
          <AgTable
            key={rows.length}
            data={rows}
            columns={recievedTicketsColumns}
          />
        ) : (
          <>
            <CircularProgress color="#1E3D73" />
          </>
        )}
      </div>
      <MuiModal
        open={openModal}
        onClose={() => setopenModal(false)}
        title="Assign Tickets"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <ul>
            {!isSubOrdinates ? (
              subOrdinates.map((employee) => (
                <div key={employee.id} className="flex flex-row gap-6">
                  <Controller
                    name={`selectedEmployees.${employee.id}`}
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        {...field}
                        checked={!!field.value}
                      />
                    )}
                  />
                  <li>{employee.name}</li>
                </div>
              ))
            ) : (
              <CircularProgress color="#1E3D73" />
            )}
          </ul>

          <div className="flex items-center justify-center mb-4">
            <PrimaryButton title="Assign" type="submit" />
          </div>
        </form>
      </MuiModal>
    </div>
  );
};

export default SupportTickets;
