import React from "react";
import AgTable from "../../../components/AgTable";
import PrimaryButton from "../../../components/PrimaryButton";
import DangerButton from "../../../components/DangerButton";

const Approvals = () => {
  const assetsColumns = [
    { field: "id", headerName: "ID", width:100 },
    { field: "department", headerName: "Department", width:150 },
    // { field: "assetNumber", headerName: "Asset Number", width:150 },
    { field: "assigneeName", headerName: "Assignee Name", width:150 },
    { field: "category", headerName: "Category", width:150 },
    { field: "brand", headerName: "Brand", width:150 },
    { field: "location", headerName: "Location",flex:1 },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => (
        <>
          <div className="p-2 mb-2 flex gap-2 items-center">
            <button className="p-2 py-2 bg-primary rounded-md text-white text-content leading-5">Approve</button>
            <button className="p-2 py-2 bg-red-200 rounded-md text-red-600 text-content leading-5">Reject</button>
          </div>
        </>
      ),
    },
  ];

  const rows = [
    {
      id: 1,
      department: "HR",
      assetNumber: "L0001",
      assigneeName: "John Doe",
      category: "Laptop",
      brand: "Lenovo",
      location: "ST-701",
      status: "Active",
    },
    {
      id: 2,
      department: "IT",
      assetNumber: "P0002",
      assigneeName: "Jane Smith",
      category: "Printer",
      brand: "HP",
      location: "ST-601",
      status: "Revoked",
    },
    {
      id: 3,
      department: "Finance",
      assetNumber: "C0003",
      assigneeName: "Michael Johnson",
      category: "Chair",
      brand: "Godrej",
      location: "ST-701",
      status: "Active",
    },
    {
      id: 4,
      department: "Marketing",
      assetNumber: "B0004",
      assigneeName: "Emily Brown",
      category: "Bottle",
      brand: "Milton",
      location: "ST-702",
      status: "Active",
    },
    {
      id: 5,
      department: "HR",
      assetNumber: "M0005",
      assigneeName: "David Wilson",
      category: "Marker",
      brand: "Camlin",
      location: "ST-602",
      status: "Revoked",
    },
    {
      id: 6,
      department: "Admin",
      assetNumber: "D0006",
      assigneeName: "Sophia Martinez",
      category: "Desk",
      brand: "IKEA",
      location: "ST-701",
      status: "Active",
    },
    {
      id: 7,
      department: "Operations",
      assetNumber: "S0007",
      assigneeName: "Chris Evans",
      category: "Scanner",
      brand: "Canon",
      location: "ST-701",
      status: "Revoked",
    },
  ];
  

  return (
    <div className="flex flex-col gap-8">
      <div>
        <AgTable
          search={true}
          searchColumn={"kra"}
          tableTitle={"Assigned Assets"}
          data={rows}
          columns={assetsColumns}
        />
      </div>
    </div>
  );
};

export default Approvals;
