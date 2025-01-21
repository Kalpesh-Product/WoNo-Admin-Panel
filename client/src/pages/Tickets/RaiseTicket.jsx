import React, { useEffect, useState } from "react";
import AgTable from "../../components/AgTable";
import PrimaryButton from "../../components/PrimaryButton";
import { Chip } from "@mui/material";
import { toast } from "sonner";

import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const RaiseTicket = () => {
  const [details, setDetails] = useState({
    department: "",
    ticketTitle: "",
    otherReason: "",
    message: "",
  });
  const [departments, setDepartments] = useState([]); // State for departments
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [ticketIssues, setTicketIssues] = useState([]); // State for ticket issues
  const [loading, setLoading] = useState(false);
   const [tickets, setTickets] = useState([]);
   const [tickets, setTickets] = useState([]);
  const axios = useAxiosPrivate();
  const { auth } = useAuth();

  // Fetch departments and ticket issues in the same useEffect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [departmentsResponse] = await Promise.all([
          axios.get("api/departments/get-departments"),
        ]);

        // Set departments and ticket issues
        setDepartments(departmentsResponse?.data?.departments || []); // Ensure fallback to an empty array

        console.log(
          "Fetched Departments:",
          departmentsResponse?.data?.departments
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axios]);

    // Reusable function to fetch tickets
    const getTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/tickets/get-tickets");
        const filteredTickets = response.data.filter(
          (ticket) => !ticket.accepted
        );
        setTickets(filteredTickets);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    // Initial data fetch when the component mounts
    useEffect(() => {
      getTickets();
    }, []);


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
    const rows = transformTicketsData(tickets);

   
  
    // Initial data fetch when the component mounts
    useEffect(() => {
       // Reusable function to fetch tickets
    const getTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/tickets/get-tickets");
        const filteredTickets = response.data.filter(
          (ticket) => !ticket.accepted
        );
        setTickets(filteredTickets);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
      getTickets();
    }, []);


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
    const rows = transformTicketsData(tickets);

   
  
    // Initial data fetch when the component mounts
    useEffect(() => {
       // Reusable function to fetch tickets
    const getTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/tickets/get-tickets");
        const filteredTickets = response.data.filter(
          (ticket) => !ticket.accepted
        );
        setTickets(filteredTickets);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
      getTickets();
    }, []);


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
    const rows = transformTicketsData(tickets);

  const handleChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

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
  ];


  const submitData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/tickets/raise-ticket", {
        departmentId: selectedDepartment,
        issue: details.ticketTitle,
        description: details.message,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error?.message);
    }

    // Reset the form values after adding the new row
    setDetails({
      RaisedBy: "",
      SelectedDepartment: "",
      TicketTitle: "",
      Priority: "",
      message: "",
      Status: "",
    });
  };

  const handleDepartmentSelect = async (e) => {
    try {
      const response = await axios.get(`/api/tickets/get-ticket-issue/${e}`);
      setTicketIssues(response.data.data);
      setSelectedDepartment(e);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="p-4 bg-white border-2 rounded-md">
        <h3 className="my-5 text-center text-3xl text-primary">
          Raise A Ticket
        </h3>
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
          <FormControl size="small" fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              label="Department"
              onChange={(e) => handleDepartmentSelect(e.target.value)}
            >
              <MenuItem value="">Select Department</MenuItem>
              {loading ? (
                <MenuItem>Loading...</MenuItem>
              ) : (
                departments?.map((dept) => (
                  <MenuItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel>Ticket Title</InputLabel>
            <Select
              label="Ticket Title"
              onChange={(e) => handleChange("ticketTitle", e.target.value)}
            >
              <MenuItem value="">Select Ticket Title</MenuItem>
              {ticketIssues.map((issue) => (
                <MenuItem key={issue._id} value={issue._id}>
                  {issue.title}
                </MenuItem>
              ))}
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="mt-4">
          {details.ticketTitle === "Others" && (
            <TextField
              size="small"
              label="Please specify the reason"
              value={details.otherReason}
              onChange={(e) => handleChange("otherReason", e.target.value)}
              multiline
              maxRows={4}
              fullWidth
            />
          )}
        </div>
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4 mt-4">
          <TextField
            size="small"
            //   disabled={!isEditable}
            label="Message"
            value={details.message}
            onChange={(e) => handleChange("message", e.target.value)}
            fullWidth
          />
          <TextField
            size="small"
            //   disabled={!isEditable}

            type="file"
            //   value={formData.motherName || ""}
            //   onChange={(e) => handleChange("motherName", e.target.value)}
            fullWidth
          />
        </div>
        <div className="flex align-middle mt-5 mb-5 items-center justify-center">
          <PrimaryButton title="Submit" handleSubmit={submitData} />
        </div>
      </div>
      <div className="rounded-md bg-white p-4 border-2 ">
        <div className="flex flex-row justify-between mb-4">
          <div className="text-[20px]">Tickets Raised Today</div>
        </div>
        <div className=" w-full">
          <AgTable
          key={rows.length}
            data={rows}
            columns={recievedTicketsColumns}
            paginationPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default RaiseTicket;
