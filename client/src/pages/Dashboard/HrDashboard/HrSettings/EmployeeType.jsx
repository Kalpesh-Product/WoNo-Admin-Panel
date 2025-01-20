import React from 'react'
import AgTable from "../../../../components/AgTable";
import { Chip } from "@mui/material";


const EmployeeType = () => {

  const departmentsColumn = [
    { field: "employeetype", headerName: "Employee Type",
      cellRenderer:(params)=>{
        return(
          <div>
            <span className="text-primary cursor-pointer hover:underline">
              {params.value}
            </span>
          </div>
        )
      },flex:1},
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
      },flex:1
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
      employeetype: "Internship",
      status: "Active",
    },
    {
      id: 2,
      employeetype: "Probation",
      status: "Active",
    },
    {
      id: 3,
      employeetype: "Full-Time",
      status: "Inactive",
    },
    {
      id: 4,
      employeetype: "Part-Time",
      status: "Active",
    },
    
  ];
  return (
    <div>
        <AgTable
          search={true}
          searchColumn={"Employee Type"}
          tableTitle={"Employee Type List"}
          buttonTitle={"Add Employee Type"}
          data={rows}
          columns={departmentsColumn}
        />
      </div>
  )
}

export default EmployeeType
