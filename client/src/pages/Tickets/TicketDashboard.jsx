import React from "react";
import WidgetSection from "../../components/WidgetSection";
import AreaGraph from "../../components/graphs/AreaGraph";
import Card from "../../components/Card";
import DonutChart from "../../components/graphs/DonutChart";

const TicketDashboard = () => {
  const ticketWidgets = [
    {
      layout: 1,
      widgets: [<AreaGraph />],
    },
    {
      layout: 5,
      widgets: [
        <Card title={"Raise A Ticket"} />,
        <Card title={"Manage Tickets"} />,
        <Card title={"Reports"} />,
        <Card title={"Team Members"} />,
        <Card title={"Ticket Settings"} />,
      ],
    },
    {
      layout: 2,
      widgets: [
        <DonutChart centerLabel={"Tickets"}/>
      ],
    },
  ];
  return (
    <div className="p-4">
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
