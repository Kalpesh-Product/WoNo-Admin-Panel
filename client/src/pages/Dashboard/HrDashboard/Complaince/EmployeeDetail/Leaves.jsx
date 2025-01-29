import React from "react";
import AgTable from "../../../../../components/AgTable";
import BarGraph from "../../../../../components/graphs/BarGraph";

const Leaves = () => {


  const leavesColumn = [
    { field: "fromDate", headerName: "From Date" },
    { field: "toDate", headerName: "To Date" },
    { field: "leaveType", headerName: "Leave Type" },
    { field: "leavePeriod", headerName: "Leave Period" },
    { field: "hours", headerName: "Hours" },
    { field: "description", headerName: "Description" },
    { field: "status", headerName: "Status", },
  ];

  const rows = [
    {
      id: 1,
      fromDate: "2025-01-01",
      toDate: "2025-01-02",
      leaveType: "Annual Leave",
      leavePeriod: "Full Day",
      hours: 8,
      description: "New Year Vacation",
      status: "Approved",
    },
    {
      id: 2,
      fromDate: "2025-02-14",
      toDate: "2025-02-14",
      leaveType: "Sick Leave",
      leavePeriod: "Half Day",
      hours: 4,
      description: "Fever",
      status: "Approved",
    },
    {
      id: 3,
      fromDate: "2025-03-08",
      toDate: "2025-03-08",
      leaveType: "Casual Leave",
      leavePeriod: "Full Day",
      hours: 8,
      description: "Personal Work",
      status: "Approved",
    },
    {
      id: 4,
      fromDate: "2025-04-10",
      toDate: "2025-04-12",
      leaveType: "Annual Leave",
      leavePeriod: "3 Days",
      hours: 24,
      description: "Family Vacation",
      status: "Approved",
    },
    {
      id: 5,
      fromDate: "2025-05-01",
      toDate: "2025-05-01",
      leaveType: "Compensatory Off",
      leavePeriod: "Full Day",
      hours: 8,
      description: "Overtime Compensation",
      status: "Approved",
    },
  ];

  const graphData = [
    {
      name: "Leaves", // Name of the series
      data: [
        { x: "Absent", y: 4 },
        { x: "Annual Leaves", y: 4 },
        { x: "Casual Leaves", y: 6 },
        { x: "Compensatory Off", y: 2 },
        { x: "Sick Leave", y: 0 },
      ],
    },
  ];
  


  const leavesOptions = {
    chart: {
      type: "bar",
      fontFamily: "Poppins-Regular",
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: ["Absent", "Annual Leaves", "Casual Leaves", "Compensatory Off", "Sick Leave"], // Match x-axis categories
    },
    yaxis: {
      min: 0,
      max: 10, // Adjust scale based on the data (10 is the maximum value in the data)
      labels: {
        formatter: (value) => `${value}`, // Keep values as-is
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} leaves`, // Show the number of leaves
      },
    },
    colors: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300"], // Custom colors
    legend: {
      position: "top",
    },
  };
  

  return (
    <div className="flex flex-col gap-8">
      <div>
        <BarGraph
          options={leavesOptions}
          data={graphData}
        />
      </div>
      <div>
        <AgTable
          search={true}
          searchColumn={"Leave Type"}
          tableTitle={"Aiwin's Leave List"}
          buttonTitle={"Add Requested Leave"}
          data={rows}
          columns={leavesColumn}
        />
      </div>
    </div>
  );
};

export default Leaves;
