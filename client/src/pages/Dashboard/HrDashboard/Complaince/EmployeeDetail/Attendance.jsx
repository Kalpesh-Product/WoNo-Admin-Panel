import React from "react";
import WidgetSection from "../../../../../components/WidgetSection";
import ScatterGraph from "../../../../../components/graphs/ScatterGraph";
import AgTable from "../../../../../components/AgTable";
import { Chip } from "@mui/material";
import { toast } from "sonner";
import BarGraph from "../../../../../components/graphs/BarGraph";
import DataCard from "../../../../../components/DataCard";

const Attendance = () => {
  const attendanceColumns = [
    { field: "date", headerName: "Date", width: 200 },
    { field: "inTime", headerName: "In Time" },
    { field: "outTime", headerName: "Out Time" },
    { field: "workHours", headerName: "Work Hours" },
    { field: "breakHours", headerName: "Break Hours" },

    { field: "totalHours", headerName: "Total Hours" },
    { field: "entryType", headerName: "Entry Type" },
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

  //Attendance graph options

  const attendanceData = [
    { x: "1-12-2024", y: 85 },
    { x: "2-12-2024", y: 90 },
    { x: "3-12-2024", y: 75 },
    { x: "4-12-2024", y: 95 },
    { x: "5-12-2024", y: 80 },
    { x: "6-12-2024", y: 70 },
    { x: "7-12-2024", y: 100 },
    { x: "8-12-2024", y: 0 },
    { x: "9-12-2024", y: 85 },
    { x: "10-12-2024", y: 90 },
    { x: "11-12-2024", y: 75 },
    { x: "12-12-2024", y: 95 },
    { x: "13-12-2024", y: 80 },
    { x: "14-12-2024", y: 70 },
    { x: "15-12-2024", y: 100 },
    { x: "16-12-2024", y: 60 },
    { x: "17-12-2024", y: 85 },
    { x: "18-12-2024", y: 90 },
    { x: "19-12-2024", y: 75 },
    { x: "20-12-2024", y: 95 },
    { x: "21-12-2024", y: 80 },
    { x: "22-12-2024", y: 70 },
    { x: "23-12-2024", y: 100 },
    { x: "24-12-2024", y: 60 },
    { x: "25-12-2024", y: 85 },
    { x: "26-12-2024", y: 90 },
    { x: "27-12-2024", y: 75 },
    { x: "28-12-2024", y: 95 },
    { x: "29-12-2024", y: 80 },
    { x: "30-12-2024", y: 70 },
    { x: "31-12-2024", y: 100 },
  ];

  // Create stacked data: completed and remaining
  const attendanceSeries = [
    {
      name: "Completed",
      data: attendanceData.map((attendance) => attendance.y), // Completed percentage
    },
    {
      name: "Remaining",
      data: attendanceData.map((attendance) => 100 - attendance.y), // Remaining percentage
    },
  ];

  // Stacked graph options
  const options = {
    chart: {
      type: "bar",
      stacked: true, // Enable stacking
      fontFamily: "Poppins-Regular",
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: attendanceData.map((item) => item.x), // Dates for x-axis
    },
    yaxis: {
      min: 0,
      max: 100, // Percentage scale
      labels: {
        formatter: (value) => `${value}%`, // Show percentages on the y-axis
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const completed = series[0][dataPointIndex]; // Completed percentage
        const remaining = 100 - completed; // Remaining percentage
        const completedHours = ((completed / 100) * 9).toFixed(2); // Completed hours
        const remainingHours = ((remaining / 100) * 9).toFixed(2); // Remaining hours

        return `
        <div style="padding: 10px; font-size: 12px;">
          <div><strong>Completed:</strong> ${completed}% (${completedHours} hours)</div>
          <div><strong>Remaining:</strong> ${remaining}% (${remainingHours} hours)</div>
        </div>
      `;
      },
    },

    colors: ["#34a853", "#ff0000"], // Green for completed, red for remaining
    legend: {
      position: "top",
    },
  };

  return (
    <div className="flex flex-col gap-4">

      <div>
        <WidgetSection layout={3} padding>
          <DataCard data={"18"} title={"Accurate Checkins"} />
          <DataCard data={"4"} title={"Late Checkins"} />
          <DataCard data={"3"} title={"Late Checkouts"} />
        </WidgetSection>
      </div>
      <div className="border-default border-borderGray rounded-md">
        <WidgetSection layout={1} title={"Current Month"}>
          <BarGraph data={attendanceSeries} options={options} />
        </WidgetSection>
      </div>

      <div>
        <AgTable
          tableTitle="Aiwin's Attendance Table"
          buttonTitle={"Correction Request"}
          search={true}
          searchColumn={"Date"}
          data={rows}
          columns={attendanceColumns}
        />
      </div>
    </div>
  );
};

export default Attendance;
