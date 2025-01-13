import React, { useState } from "react";
import AgTable from "../../components/AgTable";
import PrimaryButton from "../../components/PrimaryButton";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const RaiseTicket = () => {
  const [details, setDetails] = useState({
    department: "",
    ticketTitle: "",
    message: ""
  });

 
  const handleChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const laptopColumns = [
    { field: "RaisedBy", headerName: "Raised By",flex:1 },
    { field: "SelectedDepartment", headerName: "Selected Department",flex:1  },
    { field: "TicketTitle", headerName: "Ticket Title",flex:1  },
    { field: "Priority", headerName: "Priority",flex:1 },

    { field: "Status", headerName: "Status",flex:1 },
  ];
  const rows = [
    {
      name: "Kalpesh naik",
      role: "Tech",
      assignedToday: "80",
      totalassigned: "1203",
      totalresolved: "2204",
      resolutiontime: "33 mins",
    },
    {
      name: "Aiwin",
      role: "Tech",
      assignedToday: "80",
      totalassigned: "1203",
      totalresolved: "2204",
      resolutiontime: "34 mins",
    },
    {
      name: "Sankalp Kalangutkar",
      role: "Tech",
      assignedToday: "80",
      totalassigned: "1203",
      totalresolved: "2204",
      resolutiontime: "39 mins",
    },
    {
      name: "Anushri Bhagat",
      role: "IT",
      assignedToday: "80",
      totalassigned: "1203",
      totalresolved: "2204",
      resolutiontime: "40 mins",
    },
    {
      name: "Allen Silvera",
      role: "IT",
      assignedToday: "80",
      totalassigned: "1203",
      totalresolved: "2204",
      resolutiontime: "50 mins",
    },
  ];
  return (
    <>
      <div className=" p-2 bg-white border-2 m-4 rounded-md">
        <h3 className="my-5 text-center text-3xl text-primary">
          Raise A Ticket
        </h3>
        <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <FormControl
            size="small"
            fullWidth
            //
          >
            <InputLabel>Department</InputLabel>
            <Select
            value={details.department || ""}
            onChange={(e) => handleChange("department", e.target.value)}
            >
              <MenuItem value="">Select Department</MenuItem>
              <MenuItem value="Male">IT</MenuItem>
              <MenuItem value="Female">Tech</MenuItem>
              <MenuItem value="Other">Admin</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            size="small"
            fullWidth
            //
          >
            <InputLabel>Ticket Title</InputLabel>
            <Select
            value={details.ticketTitle || ""}
            onChange={(e) => handleChange("ticketTitle", e.target.value)}
            >
              <MenuItem value="">Select Ticket Title</MenuItem>
              <MenuItem value="Male">Wifi is not working</MenuItem>
              <MenuItem value="Female">Payroll is not working</MenuItem>
              <MenuItem value="Other">Website is taking time to load</MenuItem>
            </Select>
          </FormControl>
          
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
            label="Attachment"
            type="file"
           
            //   value={formData.motherName || ""}
            //   onChange={(e) => handleChange("motherName", e.target.value)}
            fullWidth
          />
        </div>
        <div className="flex align-middle mt-5 mb-5 items-center justify-center">
          <PrimaryButton title="Submit" />
        </div>
      </div>
      <div className="rounded-md bg-white p-4 border-2 m-4">
        <div className="flex flex-row justify-between mb-4">
          <div className="text-[20px]">Tickets Raised Today</div>
        </div>
        <div className=" w-full">
          <AgTable
            data={rows}
            columns={laptopColumns}
            paginationPageSize={10}
          />
        </div>
      </div>
    </>
  );
};

export default RaiseTicket;
