import React from "react";
import { useNavigate } from "react-router-dom";
import AgTable from "../../../components/AgTable";
import { Chip } from "@mui/material";

const ViewClients = () => {
  const navigate = useNavigate();

  const viewEmployeeColumns = [
    { field: "srno", headerName: "SR No" },
    {
      field: "clientName",
      headerName: "Client Name",
      cellRenderer: (params) => (
        <span
          style={{
            color: "#1E3D73",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={() =>
            navigate(
              `/app/dashboard/sales-dashboard/clients/view-clients/${params.data.clientID}`
            )
          }>
          {params.value}
        </span>
      ),
    },
    { field: "clientID", headerName: "Client ID" },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "credits", headerName: "Credits", flex: 1 },
    { field: "typeOfClient", headerName: "Type Of Client", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusColorMap = {
          Active: { backgroundColor: "#90EE90", color: "#006400" },
          Inactive: { backgroundColor: "#D3D3D3", color: "#696969" },
        };

        const { backgroundColor, color } = statusColorMap[params.value] || {
          backgroundColor: "gray",
          color: "white",
        };
        return (
          <Chip
            label={params.value}
            style={{
              backgroundColor,
              color,
            }}
          />
        );
      },
    },
  ];

  const rows = [
    {
      srno: "1",
      clientName: "Zomato",
      clientID: "WO001",
      email: "aiwinraj.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "2",
      clientName: "91 HR",
      clientID: "WO002",
      email: "allan.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "3",
      clientName: "WoNo",
      clientID: "WO003",
      email: "sankalp.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "4",
      clientName: "Axis Bank",
      clientID: "WO004",
      email: "anushri.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "5",
      clientName: "Turtle Mint",
      clientID: "WO005",
      email: "muskan.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "6",
      clientName: "Zimetrics",
      clientID: "WO006",
      email: "kalpesh.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "7",
      clientName: "mCaffiene",
      clientID: "WO007",
      email: "allan2.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "InActive",
    },
  ];

  return (
    <div>
      <div className="w-full">
        <AgTable
          search={true}
          searchColumn="Email"
          data={rows}
          columns={viewEmployeeColumns}
        />
      </div>
    </div>
  );
};

export default ViewClients;
