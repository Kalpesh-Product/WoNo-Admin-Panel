import React from "react";
import WidgetSection from "../../../components/WidgetSection";
import LayerBarGraph from "../../../components/graphs/LayerBarGraph";

const HrDashboard = () => {
  const series = [
    {
      name: "Tech Total",
      data: [45, 50, 40, 55, 60, 50, 65, 60, 70, 75, 80, 85],
      group:'total'
    },
    {
      name: "Sales Total",
      data: [40, 45, 35, 50, 55, 45, 60, 55, 65, 70, 75, 80],
      group:'total'
    },
    {
      name: "Tech Completed",
      data: [35, 40, 30, 45, 50, 40, 55, 50, 60, 65, 70, 75],
      group:'completed'
    },
    {
      name: "Sales Completed",
      data: [30, 35, 25, 40, 45, 35, 50, 45, 55, 60, 65, 70],
      group:'completed'
    },
  ];

  const options = {
    chart: {
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
        "January",
        "February",
        "March",
      ],
      title: {
        text: "Months of Financial Year",
      },
    },
    yaxis: {
      title: {
        text: "Number of Tasks",
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
  };

  
  const hrWidgets = [
    {
      layout: 1,
      widgets: [<LayerBarGraph
        title="Department-Wise Task Achievement"
        data={series}
        options={options}
      />],
    },
  ];
  return (
    <>
      {hrWidgets.map((widget, index) => (
        <divj>
          <WidgetSection layout={widget.layout} key={index}>
            {widget.widgets}
          </WidgetSection>
        </divj>
      ))}
    </>
  );
};

export default HrDashboard;
