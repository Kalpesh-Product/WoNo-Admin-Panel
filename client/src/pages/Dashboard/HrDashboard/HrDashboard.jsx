import React from "react";
import WidgetSection from "../../../components/WidgetSection";
import LayerBarGraph from "../../../components/graphs/LayerBarGraph";
import Card from "../../../components/Card";
import { MdRebaseEdit } from "react-icons/md";
import { LuHardDriveUpload } from "react-icons/lu";
import { CgWebsite } from "react-icons/cg";
import { SiCashapp } from "react-icons/si";
import { SiGoogleadsense } from "react-icons/si";
import { MdMiscellaneousServices } from "react-icons/md";
import { useLocation } from "react-router-dom";
import DataCard from "../../../components/DataCard";
import BarGraph from "../../../components/graphs/BarGraph";
import PayRollExpenseGraph from "../../../components/HrDashboardGraph/PayRollExpenseGraph";

const HrDashboard = () => {
  const series = [
    {
      name: "Tech Total",
      data: [45, 50, 40, 55, 60, 50, 65, 60, 70, 75, 80, 85],
      group: "total",
    },
    {
      name: "Sales Total",
      data: [40, 45, 35, 50, 55, 45, 60, 55, 65, 70, 75, 80],
      group: "total",
    },
    {
      name: "Tech Completed",
      data: [45, 40, 30, 45, 50, 40, 55, 50, 60, 65, 70, 75],
      group: "completed",
    },
    {
      name: "Sales Completed",
      data: [40, 45, 25, 40, 45, 35, 50, 45, 55, 60, 65, 70],
      group: "completed",
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
      widgets: [
        <LayerBarGraph
          title="Department-Wise Task Achievement"
          data={series}
          options={options}
        />,
      ],
    },
    {
      layout: 6,
      widgets: [
        <Card icon={<CgWebsite />} title="On Boarding" route={"/app/hr/on_boarding"} />,
        <Card icon={<LuHardDriveUpload />} title="Compliance" route={"app/hr/compliance"} />,
        <Card icon={<SiCashapp />} title="Finance" route={"app/hr/finance"}/>,
        <Card icon={<CgWebsite />} title="Performance" route={"app/hr/performanec"} />,
        <Card icon={<SiGoogleadsense />} title="Data" route={"app/hr/data"}/>,
        <Card icon={<MdMiscellaneousServices />} title="Settings" route={"app/hr/settings"} />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <Card  title="On Boarding" data="28"  />,
        <Card icon={<LuHardDriveUpload />} title="Compliance" route={"app/hr/compliance"} />,
        <Card icon={<SiCashapp />} title="Finance" route={"app/hr/finance"}/>,
        <Card icon={<CgWebsite />} title="Performance" route={"app/hr/performanec"} />,
        <Card icon={<SiGoogleadsense />} title="Data" route={"app/hr/data"}/>,
        <Card icon={<MdMiscellaneousServices />} title="Settings" route={"app/hr/settings"} />,
      ],

    }

  ];

  return (
    <>
      <PayRollExpenseGraph />
      <div>
        {hrWidgets.map((widget, index) => (
          <div>
            <WidgetSection layout={widget.layout} key={index}>
              {widget.widgets}
            </WidgetSection>
          </div>
        ))}
      </div>
      
    </>
  );
};

export default HrDashboard;
