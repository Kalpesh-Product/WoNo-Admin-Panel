import React from "react";
import AgTable from "../../components/AgTable";

const Reports = () => {
  const laptopColumns = [
    { field: "ticketid", headerName: "TICKET ID" },
    { field: "priority", headerName: "PRIORITY"},
    { field: "clientname", headerName: "CLIENT NAME" },
    { field: "status", headerName: "STATUS"},

    { field: "dueby", headerName: "DUE BY"},
    { field: "type", headerName: "TYPE"},
    { field: "solvedby", headerName: "SOLVED BY"},
  ];

  const rows = [
    {
        ticketid:"TID094678",
        priority:"Low",
        clientname:"xyz",
        status:"Open",
        dueby:"22 Dec 2024",
        type:"Technical",
        solvedby:"Shekar Khan"

    
    },
    {
        ticketid:"TID456789",
        priority:"Medium",
        clientname:"xyz",
        status:"Closed",
        dueby:"22 Dec 2024",
        type:"Technical",
        solvedby:"Shekar Khan"
    },
    {
        ticketid:"TID234896",
        priority:"Low",
        clientname:"xyz",
        status:"Paused",
        dueby:"22 Dec 2024",
        type:"Technical",
        solvedby:"Shekar Khan"
    },
    {
        ticketid:"TID234839",
        priority:"Medium",
        clientname:"xyz",
        status:"Assigned",
        dueby:"22 Dec 2024",
        type:"Technical",
        solvedby:"Shekar Khan"
    },
    {
        ticketid:"TID234567",
        priority:"High",
        clientname:"xyz",
        status:"Unassigned",
        dueby:"22 Dec 2024",
        type:"Technical",
        solvedby:"Shekar Khan"
    },
    {
        ticketid:"TID956234",
        priority:"High",
        clientname:"xyz",
        status:"Unassigned",
        dueby:"22 Dec 2024",
        type:"Technical",
        solvedby:"Shekar Khan"

    }
  ];
  return (
    <div>
      <div className="w-full rounded-md bg-white p-4 ">
        <div className="flex flex-row justify-between mb-4">
          <div>
            Tickets Reports
          </div>
        </div>
        <div className=" w-full">
          <AgTable
            data={rows}
            columns={laptopColumns}
            paginationPageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
