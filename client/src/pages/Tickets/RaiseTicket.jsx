import React, { useState } from "react";
import AgTable from "../../components/AgTable";
import PrimaryButton from "../../components/PrimaryButton";
import { Chip } from "@mui/material";

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
    otherReason: "",
    message: "",
  });

 

  const handleChange = (field, value) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

 
  const laptopColumns = [
    { field: "RaisedBy", headerName: "Raised By" },
    { field: "SelectedDepartment", headerName: "Selected Department" },
    { field: "TicketTitle", headerName: "Ticket Title", flex:1 },
    {
      field: "Priority",
      headerName: "Priority",
      cellRenderer: (params) => {
        const statusColorMap = {
          High: { backgroundColor: "#ffbac2", color: "#ed0520" }, // Light orange bg, dark orange font
          Medium: { backgroundColor: "#ADD8E6", color: "#00008B" }, // Light blue bg, dark blue font
          Low: { backgroundColor: "#90EE90", color: "#006400" }, // Light green bg, dark green font
          open: { backgroundColor: "#E6E6FA", color: "#4B0082" }, // Light purple bg, dark purple font
          Closed: { backgroundColor: "#D3D3D3", color: "#696969" }, // Light gray bg, dark gray font
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
      flex: 1,
    },

    {
      field: "Status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusColorMap = {
          Pending: { backgroundColor: "#FFECC5", color: "#CC8400" }, // Light orange bg, dark orange font
          "in-progress": { backgroundColor: "#ADD8E6", color: "#00008B" }, // Light blue bg, dark blue font
          resolved: { backgroundColor: "#90EE90", color: "#006400" }, // Light green bg, dark green font
          open: { backgroundColor: "#E6E6FA", color: "#4B0082" }, // Light purple bg, dark purple font
          Closed: { backgroundColor: "#D3D3D3", color: "#696969" }, // Light gray bg, dark gray font
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

  
  
  const [rows,setRows] = useState([
    
      {
        RaisedBy: "Abrar Shaikh",
        SelectedDepartment: "IT",
        TicketTitle: "Laptop Screen Malfunctioning",
        Priority: "High",
        Status: "In Process",
      },
      {
        RaisedBy: "Abrar Shaikh",
        SelectedDepartment: "IT",
        TicketTitle: "Request for new stationary Supplies",
        Priority: "High",
        Status: "Pending",
      },
      {
        RaisedBy: "Abrar Shaikh",
        SelectedDepartment: "IT",
        TicketTitle: "Domain Expired",
        Priority: "High",
        Status: "Pending",
      },
      {
        RaisedBy: "Abrar Shaikh",
        SelectedDepartment: "IT",
        TicketTitle: "Salary Not Revceived",
        Priority: "High",
        Status: "Closed",
      },
      {
        RaisedBy: "Abrar Shaikh",
        SelectedDepartment: "IT",
        TicketTitle: "Wifi is Not Working",
        Priority: "High",
        Status: "Pending",
      },
    ])

    const submitData = (e)=>{
      console.log("hello");
     e.preventDefault();
    setRows((prevRows) => [
      ...prevRows,
      {
        RaisedBy: "Abrar Shaikh",
        SelectedDepartment:details.department,
        TicketTitle: details.ticketTitle || details.otherReason,
        Priority: "High",
        Status: "Pending",
      }
    ]);

    // Reset the form values after adding the new row
    setDetails({
      RaisedBy: "",
      SelectedDepartment: "" ,
      TicketTitle: "",
      Priority: "",
      message:"",
      Status: "",
    });

    }

    
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="p-4 bg-white border-2 rounded-md">
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
            label="Department"
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
              label="Ticket Title"
              value={details.ticketTitle || ""}
              onChange={(e) => handleChange("ticketTitle", e.target.value)}
            >
              <MenuItem value="">Select Ticket Title</MenuItem>
              <MenuItem value="Wifi is not working">Wifi is not working</MenuItem>
              <MenuItem value="payroll is not working">Payroll is not working</MenuItem>
              <MenuItem value="website is taking time to load">
                Website is taking time to load
              </MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          </FormControl>

          {details.ticketTitle === "Others" && (
            <TextField
              size="small"
              label="Please specify the reason"
              value={details.otherReason}
              onChange={(e) => handleChange("otherReason", e.target.value)}
              fullWidth
            />
          )}

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
            data={rows}
            columns={laptopColumns}
            paginationPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default RaiseTicket;
