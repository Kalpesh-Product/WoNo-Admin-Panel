import React, { useState, useEffect } from "react";
import WidgetSection from "../../components/WidgetSection";
import Card from "../../components/Card";
import { Tab, Tabs } from "@mui/material";
import RecievedTickets from "./Tables/RecievedTickets";
import AcceptedTickets from "./Tables/AcceptedTickets";
import SupportTickets from "./Tables/SupportTickets";
import EscalatedTickets from "./Tables/EscalatedTickets";
import ClosedTickets from "./Tables/ClosedTickets";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../hooks/useAuth";

const ManageTickets = () => {
  const [activeTab, setActiveTab] = useState(0);
  const {auth} = useAuth()

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // const { data: tickets = [], isLoading } = useQuery({
  //   queryKey: ["tickets"],
  //   queryFn: async () => {
  //     try {
  //       const response = await axios.get("/api/tickets/get-tickets");
  //       const personalAcceptedTickets = response.data.filter(
  //         (ticket) => ticket.accepted === auth.user._id
  //       );
  //       const personalAssignedTickets = response.data.filter(
  //         (ticket) => 
  //           ticket.assigness.filter((assignee)=> assignee === auth.user._id)
  //         
  //       );
  //       return {personalAcceptedTickets,personalAssignedTickets};
  //     } catch (error) {
  //       throw new Error(error.response.data.message);
  //     }
  //   },
  // });




//   useEffect(()=>{
// console.log('tickets:',tickets)
//   },[tickets])


  const widgets = [
    {
      layout: 1,
      widgets: [
        <div className=" rounded-md flex  gap-4">
          <div className="border-default border-borderGray rounded-md w-full">
            <WidgetSection
              layout={3}
              title={"Department Pending Tickets"}
              titleDataColor={"red"}
              titleData={"25"}
            >
              <Card
                title={"Recieved Tickets"}
                titleColor={"#1E3D73"}
                data={"45"}
                fontColor={"#1E3D73"}
                fontFamily={"Poppins-Bold"}
              />
              <Card
                title={"Open Tickets"}
                titleColor={"#1E3D73"}
                data={"05"}
                fontColor={"#FFBF42"}
                fontFamily={"Poppins-Bold"}
              />
              <Card
                title={"Closed Tickets"}
                titleColor={"#1E3D73"}
                data={"15"}
                fontColor={"#52CE71"}
                fontFamily={"Poppins-Bold"}
              />
            </WidgetSection>
          </div>
          <div className="border-default border-borderGray rounded-md w-full">
            <WidgetSection
              layout={3}
              title={"Personal Pending Tickets"}
              titleDataColor={"black"}
              titleData={"06"}
            >
              <Card
                title={"Accepted Tickets"}
                data={"03"}
                fontColor={"#1E3D73"}
                fontFamily={"Poppins-Bold"}
                titleColor={"#1E3D73"}
              />
              <Card
                title={"Assigned Tickets"}
                data={"01"}
                fontColor={"#1E3D73"}
                fontFamily={"Poppins-Bold"}
                titleColor={"#1E3D73"}
              />
              <Card
                title={"Escalated Tickets"}
                data={"02"}
                fontColor={"#1E3D73"}
                fontFamily={"Poppins-Bold"}
                titleColor={"#1E3D73"}
              />
            </WidgetSection>
          </div>
        </div>,
      ],
    },
  ];

  return (
    <div>
      <div>
        {widgets.map((widget, index) => (
          <div>
            <WidgetSection key={index} layout={widget.layout}>
              {widget?.widgets}
            </WidgetSection>
          </div>
        ))}
      </div>

      <div className="p-4">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            border: "1px solid #d1d5db",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "medium",
              padding: "12px 16px",
              borderRight: "0.1px solid #d1d5db",
            },
            "& .Mui-selected": {
              backgroundColor: "#1E3D73", // Highlight background color for the active tab
              color: "white",
            },
          }}
        >
          <Tab
            label={
              <div className="flex flex-col gap-2 text-center">
                <span className="text-content">Recieved Tickets</span>
                <span className="text-small">Department</span>
              </div>
            }
          />
          <Tab
            label={
              <div className="flex flex-col gap-2 text-center">
                <span className="text-content">Accepted Tickets</span>
                <span className="text-small">Personal</span>
              </div>
            }
          />
          <Tab
            label={
              <div className="flex flex-col gap-2 text-center">
                <span className="text-content">Support Tickets</span>
                <span className="text-small">Personal</span>
              </div>
            }
          />
          <Tab
            label={
              <div className="flex flex-col gap-2 text-center">
                <span className="text-content">Escalated Tickets</span>
                <span className="text-small">Personal</span>
              </div>
            }
          />

          <Tab
            label={
              <div className="flex flex-col gap-2 text-center">
                <span className="text-content">Closed Tickets</span>
                <span className="text-small">Personal</span>
              </div>
            }
          />
        </Tabs>

        <div className="py-4 bg-white">
          {activeTab === 0 && (
            <div className="">
              <RecievedTickets title={"Department Ticket Recieved"} />
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <AcceptedTickets title={"Accepted & Assigned Tickets"} />
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <SupportTickets
                title={"Need Support or Pass/Unresolve Tickets "}
              />
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <EscalatedTickets
                title={"Need Support or Pass/Unresolve Tickets "}
              />
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <ClosedTickets title={"Close / Resolve Tickets"} />
            </div>
          )}
          {activeTab === 5 && <div></div>}
        </div>
      </div>
    </div>
  );
};

export default ManageTickets;
