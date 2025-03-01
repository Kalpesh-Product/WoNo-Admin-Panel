import React from "react";
import { useNavigate } from "react-router-dom";
import AgTable from "../../../components/AgTable";
import { Chip } from "@mui/material";
import BarGraph from "../../../components/graphs/BarGraph";
import UniqueClients from "./ViewClients/LeadsLayout";

const ViewClients = () => {
  const navigate = useNavigate();

  const domainData = [
    {
      month: "April",
      clients: [
        {
          client: "John Doe",
          typeOfClient: "Co-Working",
          date: "2024-04-05",
          paymentStatus: "Paid",
        },
        {
          client: "Alice Brown",
          typeOfClient: "Co-Working",
          date: "2024-04-08",
          paymentStatus: "Pending",
        },
        {
          client: "Michael Smith",
          typeOfClient: "Workations",
          date: "2024-04-12",
          paymentStatus: "Paid",
        },
        {
          client: "Sarah Wilson",
          typeOfClient: "Virtual Office",
          date: "2024-04-15",
          paymentStatus: "Unpaid",
        },
      ],
    },
    {
      month: "May",
      clients: [
        {
          client: "Emma Johnson",
          typeOfClient: "Co-Working",
          date: "2024-05-10",
          paymentStatus: "Paid",
        },
        {
          client: "Oliver Davis",
          typeOfClient: "Co-Living",
          date: "2024-05-14",
          paymentStatus: "Pending",
        },
        {
          client: "Sophia Martinez",
          typeOfClient: "Workations",
          date: "2024-05-18",
          paymentStatus: "Paid",
        },
      ],
    },
    {
      month: "June",
      clients: [
        {
          client: "Ethan Brown",
          typeOfClient: "Co-Working",
          date: "2024-06-05",
          paymentStatus: "Unpaid",
        },
        {
          client: "Isabella Clark",
          typeOfClient: "Co-Living",
          date: "2024-06-09",
          paymentStatus: "Paid",
        },
        {
          client: "Liam Johnson",
          typeOfClient: "Virtual Office",
          date: "2024-06-15",
          paymentStatus: "Pending",
        },
      ],
    },
    {
      month: "July",
      clients: [
        {
          client: "Charlotte White",
          typeOfClient: "Co-Working",
          date: "2024-07-02",
          paymentStatus: "Paid",
        },
        {
          client: "Henry Scott",
          typeOfClient: "Workations",
          date: "2024-07-14",
          paymentStatus: "Pending",
        },
      ],
    },
    {
      month: "August",
      clients: [
        {
          client: "William Carter",
          typeOfClient: "Co-Working",
          date: "2024-08-07",
          paymentStatus: "Paid",
        },
        {
          client: "Emily Adams",
          typeOfClient: "Co-Living",
          date: "2024-08-10",
          paymentStatus: "Paid",
        },
        {
          client: "Benjamin Hall",
          typeOfClient: "Virtual Office",
          date: "2024-08-20",
          paymentStatus: "Unpaid",
        },
      ],
    },
    {
      month: "September",
      clients: [
        {
          client: "Amelia Green",
          typeOfClient: "Co-Working",
          date: "2024-09-03",
          paymentStatus: "Pending",
        },
        {
          client: "Lucas Young",
          typeOfClient: "Workations",
          date: "2024-09-12",
          paymentStatus: "Paid",
        },
        {
          client: "Mason Baker",
          typeOfClient: "Virtual Office",
          date: "2024-09-21",
          paymentStatus: "Paid",
        },
      ],
    },
    {
      month: "October",
      clients: [
        {
          client: "Evelyn Nelson",
          typeOfClient: "Co-Working",
          date: "2024-10-05",
          paymentStatus: "Paid",
        },
        {
          client: "Jack Roberts",
          typeOfClient: "Co-Living",
          date: "2024-10-11",
          paymentStatus: "Unpaid",
        },
      ],
    },
    {
      month: "November",
      clients: [
        {
          client: "Lucas Harris",
          typeOfClient: "Co-Working",
          date: "2024-11-08",
          paymentStatus: "Paid",
        },
        {
          client: "Sophia Turner",
          typeOfClient: "Workations",
          date: "2024-11-14",
          paymentStatus: "Pending",
        },
        {
          client: "Daniel Collins",
          typeOfClient: "Virtual Office",
          date: "2024-11-18",
          paymentStatus: "Paid",
        },
      ],
    },
    {
      month: "December",
      clients: [
        {
          client: "Harper Walker",
          typeOfClient: "Co-Working",
          date: "2024-12-02",
          paymentStatus: "Paid",
        },
        {
          client: "Liam Wright",
          typeOfClient: "Co-Living",
          date: "2024-12-09",
          paymentStatus: "Paid",
        },
        {
          client: "Emma Lewis",
          typeOfClient: "Virtual Office",
          date: "2024-12-15",
          paymentStatus: "Pending",
        },
      ],
    },
    {
      month: "January",
      clients: [
        {
          client: "Elijah Hall",
          typeOfClient: "Co-Working",
          date: "2025-01-05",
          paymentStatus: "Paid",
        },
        {
          client: "Sophia King",
          typeOfClient: "Workations",
          date: "2025-01-11",
          paymentStatus: "Unpaid",
        },
      ],
    },
    {
      month: "February",
      clients: [
        {
          client: "James Hill",
          typeOfClient: "Co-Working",
          date: "2025-02-07",
          paymentStatus: "Paid",
        },
        {
          client: "Charlotte Allen",
          typeOfClient: "Co-Living",
          date: "2025-02-12",
          paymentStatus: "Pending",
        },
        {
          client: "Benjamin Phillips",
          typeOfClient: "Virtual Office",
          date: "2025-02-18",
          paymentStatus: "Paid",
        },
      ],
    },
    {
      month: "March",
      clients: [
        {
          client: "Oliver Parker",
          typeOfClient: "Co-Working",
          date: "2025-03-03",
          paymentStatus: "Unpaid",
        },
        {
          client: "Emily Anderson",
          typeOfClient: "Co-Living",
          date: "2025-03-10",
          paymentStatus: "Paid",
        },
        {
          client: "Noah Thomas",
          typeOfClient: "Workations",
          date: "2025-03-15",
          paymentStatus: "Paid",
        },
        {
          client: "Lucas White",
          typeOfClient: "Virtual Office",
          date: "2025-03-22",
          paymentStatus: "Pending",
        },
      ],
    },
  ];

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
      clientID: "CO001",
      email: "aiwinraj.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "2",
      clientName: "91 HR",
      clientID: "CO002",
      email: "allan.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "3",
      clientName: "WoNo",
      clientID: "CO003",
      email: "sankalp.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "4",
      clientName: "Axis Bank",
      clientID: "CO004",
      email: "anushri.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "5",
      clientName: "Turtle Mint",
      clientID: "CO005",
      email: "muskan.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "6",
      clientName: "Zimetrics",
      clientID: "CO006",
      email: "kalpesh.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "Active",
    },
    {
      srno: "7",
      clientName: "mCaffiene",
      clientID: "CO007",
      email: "allan2.wono@gmail.com",
      credits: "200",
      typeOfClient: "Coworking",
      status: "InActive",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <UniqueClients data={domainData} hideAccordion />
      </div>

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
