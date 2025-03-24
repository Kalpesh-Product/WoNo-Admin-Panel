import React from "react";
import { useNavigate } from "react-router-dom";
import AgTable from "../../../components/AgTable";
import { Chip, CircularProgress } from "@mui/material";
import BarGraph from "../../../components/graphs/BarGraph";
import UniqueClients from "./ViewClients/LeadsLayout";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { toast } from "sonner";
import { setSelectedClient } from "../../../redux/slices/clientSlice";
import { useDispatch } from "react-redux";

const ViewClients = () => {
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const dispatch = useDispatch();

  const handleClickRow = (clientData) => {
    dispatch(setSelectedClient(clientData));
    navigate(
      `/app/dashboard/sales-dashboard/clients/view-clients/${clientData.clientName}`
    );
  };

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
    { field: "id", headerName: "ID" },
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
          onClick={() => handleClickRow(params.data)}
        >
          {params.value}
        </span>
      ),
    },
    { field: "hoPocEmail", headerName: "Email", flex: 1 },
    { field: "totalMeetingCredits", headerName: "Credits" },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   cellRenderer: (params) => {
    //     const statusColorMap = {
    //       Active: { backgroundColor: "#90EE90", color: "#006400" },
    //       Inactive: { backgroundColor: "#D3D3D3", color: "#696969" },
    //     };

    //     const { backgroundColor, color } = statusColorMap[params.value] || {
    //       backgroundColor: "gray",
    //       color: "white",
    //     };
    //     return (
    //       <Chip
    //         label={params.value}
    //         style={{
    //           backgroundColor,
    //           color,
    //         }}
    //       />
    //     );
    //   },
    // },
  ];

  const { data: clientsData, isPending: isClientsDataPending } = useQuery({
    queryKey: ["clientsData"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/sales/co-working-clients");
        return response.data;
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  console.log(clientsData);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <UniqueClients data={domainData} hideAccordion />
      </div>

      {!isClientsDataPending ? (
        <>
          <div className="w-full">
            <AgTable
              search={true}
              key={clientsData.length}
              data={[
                ...clientsData.map((item, index) => ({
                  id: index + 1,
                  _id: item._id,
                  company: item.company,
                  clientName: item.clientName,
                  serviceName: item.service?.serviceName,
                  serviceDescription: item.service?.description,
                  sector: item.sector,
                  hoCity: item.hoCity,
                  hoState: item.hoState,
                  unitName: item.unit?.unitName,
                  unitNo: item.unit?.unitNo,
                  buildingName: item.unit?.building?.buildingName,
                  buildingAddress: item.unit?.building?.fullAddress,
                  cabinDesks: item.cabinDesks,
                  openDesks: item.openDesks,
                  totalDesks: item.totalDesks,
                  ratePerOpenDesk: item.ratePerOpenDesk,
                  ratePerCabinDesk: item.ratePerCabinDesk,
                  annualIncrement: item.annualIncrement,
                  perDeskMeetingCredits: item.perDeskMeetingCredits,
                  totalMeetingCredits: item.totalMeetingCredits,
                  startDate: item.startDate,
                  endDate: item.endDate,
                  lockinPeriod: item.lockinPeriod,
                  rentDate: item.rentDate,
                  nextIncrement: item.nextIncrement,
                  localPocName: item.localPoc?.name,
                  localPocEmail: item.localPoc?.email,
                  localPocPhone: item.localPoc?.phone,
                  hoPocName: item.hOPoc?.name,
                  hoPocEmail: item.hOPoc?.email,
                  hoPocPhone: item.hOPoc?.phone,
                  isActive: item.isActive,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                })),
              ]}
              columns={viewEmployeeColumns}
            />
          </div>
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default ViewClients;
