import React from "react";
import AgTable from "../../../../../components/AgTable";
import BarGraph from "../../../../../components/graphs/BarGraph";

const Leaves = () => {
  const graphData = [
    { x: "Absent", y: 4 },
    { x: "Annual Leaves", y: 4, fillColor: "#FF5733" },
    { x: "Casual Leaves", y: 6, fillColor: "#33FF57" },
    { x: "Compensatory Off", y: 2, fillColor: "#3357FF" },
    { x: "Sick Leave", y: 0, fillColor: "#FFC300" },
  ];

  const leavesColumn = [
    { field: "fromDate", headerName: "From Date" },
    { field: "toDate", headerName: "To Date" },
    { field: "leaveType", headerName: "Leave Type", flex: 1 },
    { field: "leavePeriod", headerName: "Leave Period", flex: 1 },
    { field: "hours", headerName: "Hours", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
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
    },
    {
      id: 2,
      fromDate: "2025-02-14",
      toDate: "2025-02-14",
      leaveType: "Sick Leave",
      leavePeriod: "Half Day",
      hours: 4,
      description: "Fever",
    },
    {
      id: 3,
      fromDate: "2025-03-08",
      toDate: "2025-03-08",
      leaveType: "Casual Leave",
      leavePeriod: "Full Day",
      hours: 8,
      description: "Personal Work",
    },
    {
      id: 4,
      fromDate: "2025-04-10",
      toDate: "2025-04-12",
      leaveType: "Annual Leave",
      leavePeriod: "3 Days",
      hours: 24,
      description: "Family Vacation",
    },
    {
      id: 5,
      fromDate: "2025-05-01",
      toDate: "2025-05-01",
      leaveType: "Compensatory Off",
      leavePeriod: "Full Day",
      hours: 8,
      description: "Overtime Compensation",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <BarGraph
          minValue={0}
          maxValue={20}
          colors={["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC300"]}
          categories={[
            "Absent",
            "Annual Leaves",
            "Casual Leaves",
            "Compensatory Off",
            "Sick Leave",
          ]}
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
