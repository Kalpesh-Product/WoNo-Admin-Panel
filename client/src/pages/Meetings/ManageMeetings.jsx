import React, { useState } from "react";
import WidgetSection from "../../components/WidgetSection";
import Card from "../../components/Card";
import AgTable from "../../components/AgTable";
import { Chip, MenuItem, Select } from "@mui/material";

const ManageMeetings = () => {
  const statusColors = {
    Scheduled: { bg: "#E3F2FD", text: "#1565C0" }, // Light Blue
    Ongoing: { bg: "#FFF3E0", text: "#E65100" }, // Light Orange
    Completed: { bg: "#E8F5E9", text: "#1B5E20" }, // Light Green
    Cancelled: { bg: "#FFEBEE", text: "#B71C1C" }, // Light Red
    Available: { bg: "#E3F2FD", text: "#0D47A1" },
    Occupied: { bg: "#ECEFF1", text: "#37474F" },
    Cleaning: { bg: "#E0F2F1", text: "#00796B" },
    Pending: { bg: "#FFFDE7", text: "#F57F17" },
    "In Progress": { bg: "#FBE9E7", text: "#BF360C" },
  };

  const houseKeepingOptions = ["Pending", "In Progress", "Completed"];
  const meetingChecklistData = [
    {
      id: 1,
      roomName: "Baga",
      endTime: "10:00 AM",
      houseKeepingStatus: "Pending",
      meetingStatus: "Scheduled",
      roomStatus: "Available",
      note: "Project discussion",
    },
    {
      id: 2,
      roomName: "Aqua",
      endTime: "11:30 AM",
      houseKeepingStatus: "Completed",
      meetingStatus: "Ongoing",
      roomStatus: "Occupied",
      note: "Marketing review",
    },
    {
      id: 3,
      roomName: "Lagoon",
      endTime: "2:00 PM",
      houseKeepingStatus: "In Progress",
      meetingStatus: "Completed",
      roomStatus: "Cleaning",
      note: "Client meeting",
    },
    {
      id: 4,
      roomName: "Coral",
      endTime: "3:30 PM",
      houseKeepingStatus: "Pending",
      meetingStatus: "Cancelled",
      roomStatus: "Available",
      note: "Internal team sync",
    },
  ];
  const [rowData, setRowData] = useState(meetingChecklistData);
  const handleHouseKeepingChange = (value, rowIndex) => {
    const updatedData = [...rowData];
    updatedData[rowIndex].houseKeepingStatus = value;
    setRowData(updatedData);
    console.log(rowData);
  };

  const columns = [
    { field: "roomName", headerName: "Room Name", flex: 1 },
    { field: "endTime", headerName: "End Time" },

    {
      field: "houseKeepingStatus",
      headerName: "Housekeeping Status",
      cellRenderer: (params) => {
        const rowIndex = params.node.rowIndex;
        return (
          <Select
            value={params.value}
            onChange={(e) => handleHouseKeepingChange(e.target.value, rowIndex)}
            renderValue={(selected) => (
              <Chip
                label={selected}
                sx={{
                  backgroundColor: statusColors[selected]?.bg || "#F5F5F5",
                  color: statusColors[selected]?.text || "#000",
                  borderRadius: 5,
                  padding: "4px 10px",
                  minWidth: 130,
                  justifyContent: "start",
                  fontWeight: "bold",
                }}
              />
            )}
            sx={{
              "& .MuiSelect-select": { padding: "0px !important" },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" }, // Remove border
              backgroundColor: "#f5f5f5", // Light background
              borderRadius: 5, // Rounded style
              justifyContent: "flex-start",
              minWidth: 130,
            }}
          >
            {houseKeepingOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Chip
                  label={option}
                  sx={{
                    backgroundColor: statusColors[option]?.bg || "#F5F5F5",
                    color: statusColors[option]?.text || "#000",
                    fontWeight: "bold",
                  }}
                />
              </MenuItem>
            ))}
          </Select>
        );
      },
    },

    {
      field: "meetingStatus",
      headerName: "Meeting Status",
      cellRenderer: (params) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor: statusColors[params.value]?.bg || "#F5F5F5",
            color: statusColors[params.value]?.text || "#000",
            fontWeight: "bold",
          }}
        />
      ),
    },

    {
      field: "roomStatus",
      headerName: "Room Status",
      cellRenderer: (params) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor: statusColors[params.value]?.bg || "#F5F5F5",
            color: statusColors[params.value]?.text || "#000",
            fontWeight: "bold",
          }}
        />
      ),
    },
  ];

  return (
    <div className="p-4 flex flex-col gap-4">
      <WidgetSection layout={2} padding>
        <div className="border-default border-borderGray rounded-md">
          <WidgetSection
            layout={3}
            title={"Total Meeting Bookings"}
            titleData={"45"}
            titleFont
          >
            <Card
              title={"ONGOING"}
              titleColor={"#1E3D73"}
              data={"05"}
              fontColor={"#FFBF42"}
              fontFamily={"Poppins-Bold"}
            />
            <Card
              title={"CANCELLED"}
              titleColor={"#1E3D73"}
              data={"05"}
              fontColor={"red"}
              fontFamily={"Poppins-Bold"}
            />
            <Card
              title={"EXTENDED"}
              titleColor={"#1E3D73"}
              data={"15"}
              fontColor={"#52CE71 "}
              fontFamily={"Poppins-Bold"}
            />
          </WidgetSection>
        </div>
        <div className="border-default border-borderGray rounded-md">
          <WidgetSection
            layout={3}
            title={"Total Meeting Rooms Status"}
            titleData={"09"}
            titleFont
          >
            <Card
              title={"AVAILABLE"}
              titleColor={"#1E3D73"}
              data={"03"}
              fontFamily={"Poppins-Bold"}
            />
            <Card
              title={"BOOKED"}
              titleColor={"#1E3D73"}
              data={"05"}
              fontFamily={"Poppins-Bold"}
            />
            <Card
              title={"DISABLED"}
              titleColor={"#1E3D73"}
              data={"01"}
              fontFamily={"Poppins-Bold"}
            />
          </WidgetSection>
        </div>
      </WidgetSection>

      <div className="p-4 border-default border-borderGray rounded-md">
        <div className="flex flex-col gap-4">
            <div>
                <span className="text-title text-primary">Meeting Room Checklist</span>
            </div>
          <AgTable
            data={rowData}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageMeetings;
