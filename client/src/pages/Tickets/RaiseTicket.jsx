import React, { useEffect, useState } from "react";
import AgTable from "../../components/AgTable";
import PrimaryButton from "../../components/PrimaryButton";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";

import { TextField, MenuItem } from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Controller, useForm } from "react-hook-form";
import { LuImageUp, LuImageUpscale } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import MuiModal from "../../components/MuiModal";

const RaiseTicket = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ticketIssues, setTicketIssues] = useState([]); // State for ticket issues
  const [openModal, setOpenModal] = useState(false);
  const axios = useAxiosPrivate();

  // Fetch departments and ticket issues in the same useEffect

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        "api/company/get-company-data?field=selectedDepartments"
      );
      return response.data?.selectedDepartments;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const { data: fetchedDepartments = [], isPending: departmentLoading } =
    useQuery({
      queryKey: ["fetchedDepartments"],
      queryFn: fetchDepartments,
    });

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      department: "",
      ticketTitle: "",
      newIssue: "",
      message: "",
      issue:null
    },
    mode: "onSubmit",
  });

  const watchFields = watch();

  const { mutate: raiseTicket, isPending: pendingRaise } = useMutation({
    mutationFn: async (data) => {
      try {
        const formData = new FormData();

        formData.append("departmentId", data.department);
        formData.append("issueId", data.ticketTitle);
        formData.append("description", data.message);
        if (data.newIssue) {
          formData.append("newIssue", data.newIssue);
        }
  
        // Append image if exists
        if (data.image) {
          formData.append("issue", data.image); // Key name should match backend expectations
        }

        const response = await axios.post("/api/tickets/raise-ticket", formData, {
          headers:{
            "Content-Type" : 'multipart/form-data'
          }
        })
        toast.success(response.data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    },
  });

  const onSubmit = (data) => {
    raiseTicket(data);
    reset();
  };

  const { data: tickets, isPending: ticketsLoading } = useQuery({
    queryKey: ["my tickets"],
    queryFn: async function () {
      const response = await axios.get("/api/tickets/today");
      return response.data;
    },
  });

  const handleDepartmentSelect = (deptId) => {
    setSelectedDepartment(deptId);

    // Find the selected department and get its ticketIssues
    const selectedDept = fetchedDepartments.find(
      (dept) => dept.department._id === deptId
    );

    setTicketIssues(selectedDept?.ticketIssues || []);
  };

  const getOtherTicketId = () => {
    // Find the "Other" issue from the selected department
    const otherTicket = ticketIssues.find((issue) => issue.title === "Other");
    return otherTicket ? otherTicket._id : null;
  };

  const recievedTicketsColumns = [
    { field: "raisedBy", headerName: "Raised By" },
    { field: "raisedTo", headerName: "To Department" },
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
  ];

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="p-4 bg-white border-2 rounded-md">
        <h3 className="my-5 text-center text-3xl text-primary">
          Raise A Ticket
        </h3>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
              <Controller
                name="department"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      select
                      label={"Department"}
                      error={!!errors.department}
                      helperText={errors.department?.message}
                      size="small"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleDepartmentSelect(e.target.value);
                      }}
                    >
                      <MenuItem value="">Select Department</MenuItem>
                      {departmentLoading ? (
                        <CircularProgress color="black" />
                      ) : (
                        fetchedDepartments?.map((dept) => (
                          <MenuItem
                            key={dept.department._id}
                            value={dept.department._id}
                          >
                            {dept.department.name}
                          </MenuItem>
                        ))
                      )}
                    </TextField>
                  </>
                )}
              />

              <Controller
                name="ticketTitle"
                control={control}
                rules={{ required: "Please select an Issue" }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      size="small"
                      select
                      label="Issue"
                      helperText={errors.ticketTitle?.message}
                      error={!!errors.ticketTitle}
                      disabled={!watchFields.department}
                    >
                      <MenuItem value="">Select Ticket Title</MenuItem>
                      {ticketIssues.length > 0 ? (
                        ticketIssues.map((issue) => (
                          <MenuItem key={issue._id} value={issue._id}>
                            {issue.title}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No Issues Available</MenuItem>
                      )}
                    </TextField>
                  </>
                )}
              />
              {watchFields.ticketTitle === getOtherTicketId() && (
                <Controller
                  name="newIssue"
                  control={control}
                  rules={{
                    validate: (value) =>
                      watchFields.ticketTitle === getOtherTicketId()
                        ? value.trim().length > 0 || "Please specify the reason"
                        : true,
                  }}
                  render={({ field }) => (
                    <>
                      <TextField
                        {...field}
                        label="Please specify the reason"
                        className="col-span-2"
                        multiline
                        rows={3}
                        error={!!errors.newIssue}
                        helperText={errors.newIssue?.message}
                        fullWidth
                      />
                    </>
                  )}
                />
              )}
              <Controller
                name="message"
                rules={{ required: "Please specify your message" }}
                control={control}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      size="small"
                      label="Message"
                      error={!!errors.message}
                      helperText={errors.message?.message}
                      fullWidth
                    />
                  </>
                )}
              />
              <Controller
                name="image"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box className="flex flex-col gap-2">
                    {/* File Input */}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      id="image-upload"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          onChange(file);
                          setPreview(URL.createObjectURL(file)); // Set preview
                        }
                      }}
                    />

                    {/* Clickable TextField */}
                    <TextField
                      size="small"
                      variant="outlined"
                      fullWidth
                      label="Upload Image"
                      value={value ? value.name : ""}
                      placeholder="Choose a file..."
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <IconButton
                            color="primary"
                            component="label"
                            htmlFor="image-upload"
                          >
                            <LuImageUp />
                          </IconButton>
                        ),
                      }}
                    />

                    {/* Image Preview & Delete Icon */}
                    {preview && (
                      <>
                        <span
                          className="underline text-primary text-content"
                          onClick={() => setOpenModal(true)}
                        >
                          Preview
                        </span>
                        <MuiModal
                          open={openModal}
                          onClose={() => setOpenModal(false)}
                          title={"Preview File"}
                        >
                          <div>
                            <div className="flex flex-col">
                              <IconButton
                                color="error"
                                onClick={() => {
                                  onChange(null);
                                  setPreview(null);
                                }}
                              >
                                <MdDelete />
                              </IconButton>
                              <div className="p-2 border-default border-borderGray rounded-md">
                                <Avatar
                                  src={preview}
                                  alt="Preview"
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 2,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </MuiModal>
                      </>
                    )}
                  </Box>
                )}
              />
            </div>

            <div className="flex align-middle mt-5 mb-5 items-center justify-center">
              <PrimaryButton
                disabled={pendingRaise}
                isLoading={pendingRaise}
                title="Submit"
                type={"submit"}
              />
            </div>
          </form>
        </div>
      </div>
      <div className="rounded-md bg-white p-4 border-2 ">
        <div className="flex flex-row justify-between mb-4">
          <div className="text-[20px]">My today&apos;s tickets</div>
        </div>
        <div className=" w-full">
          {ticketsLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <CircularProgress color="black" />
            </div>
          ) : (
            <AgTable
              key={tickets.length}
              search
              data={[...tickets.map((ticket, index)=>({
                id : index +1,
                raisedBy : ticket.raisedBy.firstName,
                raisedTo: ticket.raisedToDepartment.name,
                ticketTitle : ticket.ticket,
                status : ticket.status
              }))]}
              columns={recievedTicketsColumns}
              paginationPageSize={10}
            />
     
          )}
        </div>
      </div>
    </div>
  );
};

export default RaiseTicket;
