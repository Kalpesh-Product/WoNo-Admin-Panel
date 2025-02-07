import React from "react";
import AgTable from "../../../../../components/AgTable";
import BarGraph from "../../../../../components/graphs/BarGraph";
import CustomYAxis from "../../../../../components/graphs/CustomYAxis";
import WidgetSection from '../../../../../components/WidgetSection'
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";

const Leaves = () => {
  const axios = useAxiosPrivate()
  const { data: leaves = [] } = useQuery({
    queryKey: ["leaves"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/leaves/view-all-leaves-before-today");
        return response.data
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });
  const leavesColumn = [
    { field: "fromDate", headerName: "From Date" },
    { field: "toDate", headerName: "To Date" },
    { field: "leaveType", headerName: "Leave Type" },
    { field: "leavePeriod", headerName: "Leave Period" },
    { field: "hours", headerName: "Hours" },
    { field: "description", headerName: "Description" },
    { field: "status", headerName: "Status" },
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

  const leavesData = {
    user: "Aiwin",
    allocated: 12,
    taken: 2,
    remaining: 10,
    monthlyData: [
      {
        month: "January",
        monthIndex: 1,
        year: 2025,
        privilegedLeaves: 1,
        sickLeaves: 1,
        casualLeaves: 0,
      },
    ],
  };

  // Prepare data for ApexCharts
  const months = leavesData.monthlyData.map((entry) => entry.month);

  // Series data (stacked bar with allocated vs taken)
  const series = [
    {
      name: "Privileged Leaves (Taken)",
      data: leavesData.monthlyData.map((entry) => entry.privilegedLeaves),
      color: "#FF4560", // Red for taken leaves
    },
    {
      name: "Privileged Leaves (Remaining)",
      data: leavesData.monthlyData.map((entry) =>
        Math.max(leavesData.allocated / 3 - entry.privilegedLeaves, 0)
      ),
      color: "#00E396", // Green for remaining allocation
    },
    {
      name: "Sick Leaves (Taken)",
      data: leavesData.monthlyData.map((entry) => entry.sickLeaves),
      color: "#775DD0", // Purple for taken leaves
    },
    {
      name: "Sick Leaves (Remaining)",
      data: leavesData.monthlyData.map((entry) =>
        Math.max(leavesData.allocated / 3 - entry.sickLeaves, 0)
      ),
      color: "#4CAF50", // Green for remaining allocation
    },
    {
      name: "Casual Leaves (Taken)",
      data: leavesData.monthlyData.map((entry) => entry.casualLeaves),
      color: "#FBC02D", // Yellow for taken leaves
    },
    {
      name: "Casual Leaves (Remaining)",
      data: leavesData.monthlyData.map((entry) =>
        Math.max(leavesData.allocated / 3 - entry.casualLeaves, 0)
      ),
      color: "#29B6F6", // Blue for remaining allocation
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* <div>
        <BarGraph
          options={options}
          data={series}
        />
      </div> */}
      <div>
        <WidgetSection layout={1} title={"Leaves Data"} border>
          <CustomYAxis />
        </WidgetSection>
      </div>
      <div>
        <AgTable
        key={leaves.length}
          search={true}
          searchColumn={"Leave Type"}
          tableTitle={"Aiwin's Leave List"}
          buttonTitle={"Add Requested Leave"}
          data={[...leaves.map((leave,index)=>({
            id : index+1,
            fromDate : new Date(leave.fromDate).toLocaleDateString(),
            toDate : new Date(leave.toDate).toLocaleDateString(),
            leaveType : leave.leaveType,
            leavePeriod : leave.leavePeriod,
            hours : leave.hours,
            description:leave.description,
            status:leave.status
          }))]}
          columns={leavesColumn}
        />
      </div>
    </div>
  );
};

export default Leaves;
