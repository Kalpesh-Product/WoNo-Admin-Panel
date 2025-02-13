import React, { useEffect, useState } from "react";
import AgTable from "../../../components/AgTable";

const AssignedAssets = () => {
  const [assetRows, setAssetRows] = useState([
    {
      id: 1,
      department: "HR",
      assetNumber: "L0001",
      assigneeName: "John Doe",
      category: "Laptop",
      brand: "Lenovo",
      location: "ST-701",
      status: "Active",
      isRevoked: false,
      assignmentDate: "21/11/2024",
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
      isRevoked: true,
      assignmentDate: "21/11/2024",
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
      isRevoked: false,
      assignmentDate: "21/11/2024",
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
      isRevoked: false,
      assignmentDate: "21/11/2024",
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
      isRevoked: true,
      assignmentDate: "21/11/2024",
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
      isRevoked: false,
      assignmentDate: "21/11/2024",
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
      isRevoked: true,
      assignmentDate: "21/11/2024",
    },
  ]);

  // 🔥 Fix: Force re-render after revocation
  const [updatedRows, setUpdatedRows] = useState(assetRows);

  // Function to handle "Revoke" action
  const handleRevoke = (id) => {
    setAssetRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, status: "Revoked", isRevoked: true } : row
      )
    );
  };

  // 🔄 Ensures AgTable re-renders when `assetRows` changes
  useEffect(() => {
    setUpdatedRows([...assetRows]); // Force UI update
  }, [assetRows]);

  const assetsColumns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "department", headerName: "Department", width: 150 },
    { field: "assigneeName", headerName: "Assignee Name", width: 150 },
    { field: "assetNumber", headerName: "Asset Number", width: 150 },
    { field: "category", headerName: "Category", width: 150 },
    { field: "brand", headerName: "Brand", width: 150 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "assignmentDate", headerName: "Assignment Date", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => {
        const { id, isRevoked } = params.data;
        if (isRevoked) return null;
        return (
          <div className="p-2 mb-2 flex gap-2 items-center">
            <button className="p-2 py-2 bg-primary rounded-md text-white text-content leading-5">
              Details
            </button>
            <button
              onClick={() => handleRevoke(id)}
              className="p-2 py-2 bg-red-200 rounded-md text-red-600 text-content leading-5"
            >
              Revoke
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <AgTable
          search={true}
          searchColumn={"assetNumber"}
          tableTitle={"Assigned Assets"}
          data={updatedRows} // ✅ Pass updatedRows instead of assetRows
          columns={assetsColumns}
          rowStyle={(params) => ({
            backgroundColor: params.data.isRevoked ? "#f2f2f2" : "white",
            color: params.data.isRevoked ? "#a0a0a0" : "black",
          })}
        />
      </div>
    </div>
  );
};

export default AssignedAssets;
