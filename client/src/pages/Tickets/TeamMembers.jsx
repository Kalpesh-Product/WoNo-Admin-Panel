import React from "react";
import AgTable from "../../components/AgTable";
import PrimaryButton from "../../components/PrimaryButton";

const TeamMembers = () => {
  const laptopColumns = [
    { field: "name", headerName: "NAME", flex: 1 },
    { field: "role", headerName: "ROLE", flex: 1 },
    { field: "assignedToday", headerName: "ASSIGNED TODAY", flex: 1 },
    { field: "totalassigned", headerName: "TOTAL ASSIGNED", flex: 1 },

    { field: "totalresolved", headerName: "TOTAL RESOLVED", flex: 1 },
    { field: "resolutiontime", headerName: "RESOLUTION TIME", flex: 1 },
    
  ];
  const rows = [
    {
      name:"Kalpesh naik",
      role:"Tech",
      assignedToday: "80",
      totalassigned: "1203",
      totalresolved: "2204",
      resolutiontime: "33 mins",
      
    },
    {
      name:"Aiwin",
      role:"Tech",
      assignedToday: "80",
      totalassigned: "1203",
      totalresolved: "2204",
      resolutiontime: "34 mins",
    },
    {
      name:"Sankalp Kalangutkar",
      role:"Tech",
      assignedToday: "80",
      totalassigned: "1203",
      totalresolved: "2204",
      resolutiontime: "39 mins",
    },
    {
      name:"Anushri Bhagat",
      role:"IT",
      assignedToday: "80",
      totalassigned: "1203",
      totalresolved: "2204",
      resolutiontime: "40 mins",
    },
    {
      name:"Allen Silvera",
      role:"IT",
      assignedToday: "80",
      totalassigned: "1203",
      totalresolved: "2204",
      resolutiontime: "50 mins",
    }
  ];
  return (
    <div className="w-full rounded-md bg-white p-4 ">
      <div className="flex flex-row justify-between mb-4">
        <div>
          Total Team Members: <b>{rows.length}</b>
        </div>
        <PrimaryButton title="Add New Member"></PrimaryButton>
      </div>
      <div className=" w-full">
        <AgTable data={rows} columns={laptopColumns} paginationPageSize={10} />
      </div>
    </div>
  );
};

export default TeamMembers;
