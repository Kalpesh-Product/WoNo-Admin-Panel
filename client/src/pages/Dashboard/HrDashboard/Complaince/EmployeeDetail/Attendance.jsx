import React from "react";
import WidgetSection from "../../../../../components/WidgetSection";
import ScatterGraph from "../../../../../components/graphs/ScatterGraph";
import AgTable from "../../../../../components/AgTable"
import { Chip } from "@mui/material";
import { toast } from "sonner";

const Attendance = () => {
  const attendanceColumns = [
    { field: "date", headerName: "Date", width:200 },
    { field: "inTime", headerName: "In Time",  },
    { field: "outTime", headerName: "Out Time",  },
    { field: "workHours", headerName: "Work Hours"},
    { field: "breakHours", headerName: "Break Hours" },

    { field: "totalHours", headerName: "Total Hours"},
    { field: "entryType", headerName: "Entry Type",  },
    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusColorMap = {
          Sync: { backgroundColor: "#90EE90", color: "#006400" }, // Light green bg, dark green font
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
  const rows = [
    {
      id: 1,
      date: "2025-01-20",
      inTime: "09:00 AM",
      outTime: "05:30 PM",
      workHours: "8h 30m",
      breakHours: "1h",
      totalHours: "9h 30m",
      entryType: "Biometric",
      status: "Sync",
    },
    {
      id: 2,
      date: "2025-01-19",
      inTime: "09:15 AM",
      outTime: "05:45 PM",
      workHours: "8h 15m",
      breakHours: "45m",
      totalHours: "9h",
      entryType: "Manual",
      status: "Sync",
    },
    {
      id: 3,
      date: "2025-01-18",
      inTime: "09:00 AM",
      outTime: "05:00 PM",
      workHours: "8h",
      breakHours: "1h",
      totalHours: "9h",
      entryType: "Biometric",
      status: "Sync",
    },
    {
      id: 4,
      date: "2025-01-17",
      inTime: "09:30 AM",
      outTime: "06:00 PM",
      workHours: "8h 30m",
      breakHours: "1h",
      totalHours: "9h 30m",
      entryType: "Biometric",
      status: "Sync",
    },
    {
      id: 5,
      date: "2025-01-16",
      inTime: "09:00 AM",
      outTime: "05:30 PM",
      workHours: "8h 30m",
      breakHours: "30m",
      totalHours: "9h",
      entryType: "Manual",
      status: "Sync",
    },
  ];
  
  return (
    <div className="flex flex-col gap-4">
      <div className="border-default border-borderGray rounded-md">
        <WidgetSection layout={1} title={"Current Month"}>
          <ScatterGraph />
        </WidgetSection>
      </div>

      <div>
        <AgTable tableTitle="Aiwin's Attendance Table" buttonTitle={"Correction Request"}  search={true} searchColumn={"Date"} data={rows} columns={attendanceColumns} />
      </div>
    </div>
  );
};

export default Attendance;
