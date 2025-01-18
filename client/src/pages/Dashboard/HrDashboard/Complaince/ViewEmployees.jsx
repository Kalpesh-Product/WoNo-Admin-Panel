import React from "react";
import AgTable from "../../../../components/AgTable";
import { Chip } from "@mui/material";

const ViewEmployees = () => {
  const viewEmployeeColumns = [
    { field: "employeeName", headerName: "Employee Name" },
    { field: "employmentID", headerName: "Employment ID" },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },

    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusColorMap = {
          Active: { backgroundColor: "#90EE90", color: "#006400" }, // Light green bg, dark green font
          Inactive: { backgroundColor: "#D3D3D3", color: "#696969" }, // Light gray bg, dark gray font
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
      employeeName: "Aiwinraj",
      employmentID: "WO001",
      email: "aiwinraj.wono@gmail.com",
      role: "Employee",
      status: "Active",
    },
    {
      employeeName: "Allan",
      employmentID: "WO002",
      email: "allan.wono@gmail.com",
      role: "Employee",
      status: "Active",
    },
    {
      employeeName: "Sankalp",
      employmentID: "WO003",
      email: "sankalp.wono@gmail.com",
      role: "Employee",
      status: "Active",
    },
    {
      employeeName: "Anushri",
      employmentID: "WO004",
      email: "anushri.wono@gmail.com",
      role: "Employee",
      status: "Active",
    },
    {
      employeeName: "Muskan",
      employmentID: "WO005",
      email: "muskan.wono@gmail.com",
      role: "Employee",
      status: "Active",
    },
    {
      employeeName: "Kalpesh",
      employmentID: "WO006",
      email: "kalpesh.wono@gmail.com",
      role: "Employee",
      status: "Active",
    },
    {
      employeeName: "Allan2",
      employmentID: "WO007",
      email: "allan2.wono@gmail.com",
      role: "Employee",
      status: "InActive",
    },
  ];
  return (
    <div>
      <div className="w-full">
        <AgTable search={true} searchColumn="Email" data={rows} columns={viewEmployeeColumns} />
      </div>
    </div>
  );
};

export default ViewEmployees;
