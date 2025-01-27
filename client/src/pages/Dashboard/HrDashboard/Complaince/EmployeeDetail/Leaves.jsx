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

// Hardcoded current month (1 = January, 2 = February, etc.)
const currentMonthIndex = 2; // Set to February for this example
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Allocated leaves per month
const leavesAllocatedPerMonth = 1; // 1 leave per month

// Total allocated leaves up to the current month
const totalAllocatedLeaves = leavesAllocatedPerMonth * currentMonthIndex;

// Leaves taken by the user in each month
const leavesTakenPerMonth = {
  January: 2, // User took 2 leaves in January

};

// Calculate cumulative leaves taken up to the current month
const cumulativeLeavesTaken = Object.keys(leavesTakenPerMonth)
  .slice(0, currentMonthIndex) // Consider only months up to the current month
  .reduce((sum, month) => sum + (leavesTakenPerMonth[month] || 0), 0);

// Calculate bar segments
const usedWithinLimit = Math.min(cumulativeLeavesTaken, totalAllocatedLeaves); // Green portion
const exceededLeaves = Math.max(cumulativeLeavesTaken - totalAllocatedLeaves, 0); // Red portion

// Graph data
const graphData = [
  {
    name: "Used (Within Limit)",
    data: [{ x: "Privileged Leaves", y: usedWithinLimit }],
  },
  {
    name: "Exceeded (Over Limit)",
    data: [{ x: "Privileged Leaves", y: exceededLeaves }],
  },
];

// Graph options
const leavesOptions = {
  chart: {
    type: "bar",
    stacked: true,
    fontFamily: "Poppins-Regular",
    toolbar: {
      show: true,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      columnWidth: "60%",
      borderRadius: 2,
    },
  },
  xaxis: {
    categories: months.slice(0, currentMonthIndex), // Show months up to the current month
    title: {
      text: "Months",
    },
  },
  yaxis: {
    categories: ["Privileged Leaves"], // Leave type as the y-axis category
    title: {
      text: "Leave Types",
    },
  },
  tooltip: {
    y: {
      formatter: (value) => `${value} leaves`, // Tooltip shows leave count
    },
  },
  colors: ["#33FF57", "#FF5733"], // Green for within limit, red for exceeded
  legend: {
    position: "top",
    horizontalAlign: "center",
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
