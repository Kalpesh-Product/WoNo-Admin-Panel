import React from "react";
import AgTable from "../../../../components/AgTable";
import { Chip } from "@mui/material";

const HrSettingsDepartments = () => {
  const departmentsColumn = [
    { field: "departmentName", headerName: "Department Name",
      cellRenderer:(params)=>{
        return(
          <div>
            <span className="text-primary cursor-pointer hover:underline">
              {params.value}
            </span>
          </div>
        )
      }, flex:1 },
    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusColorMap = {
          Inactive: { backgroundColor: "#FFECC5", color: "#CC8400" }, // Light orange bg, dark orange font
          Active: { backgroundColor: "#90EE90", color: "#006400" }, // Light green bg, dark green font
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
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => (
        <>
          <div className="p-2 mb-2 flex gap-2">
           <span className="text-content text-primary hover:underline cursor-pointer">
            Make Inactive
           </span>
          </div>
        </>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      departmentName: "Tech",
      status: "Active",
    },
    {
      id: 2,
      departmentName: "Finance",
      status: "Active",
    },
    {
      id: 3,
      departmentName: "Sales",
      status: "Inactive",
    },
    {
      id: 4,
      departmentName: "Cafe",
      status: "Active",
    },
    {
      id: 5,
      departmentName: "IT",
      status: "Inactive",
    },
  ];
  

  return (
    <div className="flex flex-col gap-8">
      <div>
        <AgTable
          search={true}
          searchColumn={"Department Name"}
          tableTitle={"Department List"}
          buttonTitle={"Add Department"}
          data={rows}
          columns={departmentsColumn}
        />
      </div>
    </div>
  );
};

export default HrSettingsDepartments;
