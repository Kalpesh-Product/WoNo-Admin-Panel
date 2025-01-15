import React from "react";
import WidgetSection from "../../components/WidgetSection";
import AreaGraph from "../../components/graphs/AreaGraph";
import Card from "../../components/Card";
import DonutChart from "../../components/graphs/DonutChart";
import { RiArchiveDrawerLine } from "react-icons/ri";
import { RiPagesLine } from "react-icons/ri";
import { MdFormatListBulleted } from "react-icons/md";
import { CgProfile } from "react-icons/cg"

const TicketDashboard = () => {
  const ticketWidgets = [
    {
      layout: 1,
      widgets: [<AreaGraph />],
    },
    {
      layout: 5,
      widgets: [
        <Card route={"/app/tickets/raise-ticket"} title={"Raise A Ticket"} icon={<RiPagesLine/>}/>,
        <Card route={"/app/tickets/manage-tickets"} title={"Manage Tickets"} icon={<RiArchiveDrawerLine/>} />,
        <Card route={"/app/tickets/Reports"} title={"Reports"}  icon={<MdFormatListBulleted/>} />,
        <Card route={"/app/tickets/team-members"} title={"Team Members"} icon={<CgProfile/>} />,
        <Card route={"/app/tickets/ticket-settings"} title={"Ticket Settings"} icon={<RiPagesLine/>} />,
      ],
    },
    {
      layout: 2,
      widgets: [
        <DonutChart
          title={"Total Tickets (Last Month)"}
          series={[49, 21, 30]}
          labels={["High", "Medium", "Low"]}
          colors={["#ff4d4d", "#ffc107", "#28a745"]}
          centerLabel={"Tickets"}
        />,
        <DonutChart
          title={"Department Tickets (Last Month)"}
          series={[30, 44, 50]}
          labels={["IT", "Maintainance", "Admin"]}
          colors={["#86D1DE", "#67B6DB", "#00CDD1"]}
          centerLabel={"Tickets"}
        />,
      ],
    },
    {
      layout: 2,
      widgets: [
        <div className="border-default border-borderGray  rounded-md">
          <div className="">
            <WidgetSection layout={2} title={"Basic Priority Dashboard"} >
              <Card
                title={"MT. AV. Performance"}
                bgcolor={"#60A5F9"}
                data={"70%"}
                titleColor={"white"}
                fontColor={"white"}
                height={"10rem"}
              />
              <Card
                title={"Immediate Attended"}
                data={"12"}
                bgcolor={"#FF0000"}
                titleColor={"white"}
                fontColor={"white"}
                height={"10rem"}
              />
              <Card
                title={"Medium Attended"}
                data={"10"}
                bgcolor={"#FFBF42"}
                titleColor={"white"}
                fontColor={"white"}
                height={"10rem"}
              />
              <Card
                title={"Low Attended"}
                data={"26"}
                bgcolor={"#01D870"}
                titleColor={"white"}
                fontColor={"white"}
                height={"10rem"}
              />
            </WidgetSection>
          </div>
        </div>,

        <div className=" rounded-md flex flex-col gap-4">
          <div className="border-default border-borderGray rounded-md"> 
            <WidgetSection layout={3} title={"Department Tickets List"}>
              <Card title={"Open Tickets"} titleColor={"#1E3D73"} data={"100"} fontColor={"red"} fontFamily={"Poppins-Bold"} />
              <Card title={"Closed Tickets"} titleColor={"#1E3D73"} data={"75"} fontColor={"#52CE71"} fontFamily={"Poppins-Bold"} />
              <Card title={"Pending Tickets"} titleColor={"#1E3D73"} data={"200"} fontColor={"#FFBF42"} fontFamily={"Poppins-Bold"} />
            </WidgetSection>
          </div>
          <div className="border-default border-borderGray rounded-md">
            <WidgetSection layout={3} title={"Personal Tickets List"}>
              <Card title={"Accepted Tickets"} data={"106"} fontColor={"black"} fontFamily={"Poppins-Bold"} />
              <Card title={"Assigned Tickets"} data={"65"} fontColor={"black"} fontFamily={"Poppins-Bold"} />
              <Card title={"Escalated Tickets"} data={"50"} fontColor={"black"} fontFamily={"Poppins-Bold"} />
            </WidgetSection>
          </div>
        </div>
      ],
    },
  ];
  return (
    <div>
      <div>
        {ticketWidgets.map((widget, index) => (
          <div>
            <WidgetSection key={index} layout={widget.layout}>
              {widget?.widgets}
            </WidgetSection>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketDashboard;
