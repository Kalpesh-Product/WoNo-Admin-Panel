import React from 'react'
import AgTable from "../../../../components/AgTable";
import { Chip } from "@mui/material";


const HrSettingsPolicies = () => {

   const departmentsColumn = [
        { field:"srno", headerName:"SR No",width:"100"},
        { field: "policyname", headerName: "POLICY NAME",
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
      srno:"1",
      id: 1,
      policyname: "Biz Nest Leave Policy",
      status: "Active",
    },
    {
      srno:"2",
      id: 2,
      policyname: "Biz Nest Leave Policy",
      status: "Active",
    },
    {
      srno:"3",
      id: 3,
      policyname: "Biz Nest Leave Policy",
      status: "Inactive",
    },
    {
      srno:"4",
      id: 4,
      policyname: "Biz Nest Leave Policy",
      status: "Active",
    },
    
  ];
  return (
    <div>
        <AgTable
          search={true}
          searchColumn={"Policies"}
          tableTitle={"Policy List"}
          buttonTitle={"Add Policy"}
          data={rows}
          columns={departmentsColumn}
        />
      </div>
  )
}

export default HrSettingsPolicies
