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
  // Original data
  const rawSeries = [

    {
      name: "Sales Total",
      data: [40, 45, 35, 50, 55, 45, 60, 55, 65, 70, 75, 80],
      group: "total",
    },
    {
      name: "Tech Total",
      data: [45, 50, 40, 55, 60, 50, 65, 60, 70, 75, 80, 85],
      group: "total",
    },
    {
      name: "Space Total",
      data: [],
      group: "space",
    },

    {
      name: "Sales Completed",
      data: [40, 45, 25, 40, 45, 35, 50, 45, 55, 60, 65, 70],
      group: "completed",
    },
    {
      name: "Tech Completed",
      data: [45, 40, 30, 45, 50, 40, 55, 50, 60, 65, 70, 75],
      group: "completed",
    },
  ];

  // Function to normalize data to percentage
  const normalizeToPercentage = (series) => {
    const months = series[0].data.length;
    const normalizedSeries = [];

    for (let i = 0; i < months; i++) {
      const totalForMonth = series
        .filter((s) => s.group === "total")
        .reduce((sum, s) => sum + s.data[i], 0);

      series.forEach((s) => {
        if (!normalizedSeries.some((ns) => ns.name === s.name)) {
          normalizedSeries.push({ name: s.name, data: [], group: s.group });
        }

        const percentage = totalForMonth
          ? (s.data[i] / totalForMonth) * 100
          : 0;

        normalizedSeries.find((ns) => ns.name === s.name).data.push(percentage);
      });
    }

    return normalizedSeries;
  };

  // Normalize data
  const series = normalizeToPercentage(rawSeries);

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      fontFamily: 'Poppins-Regular, Arial, sans-serif'
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: [5], // Radius for rounded corners
      borderRadiusWhenStacked: "all", // Apply borderRadius consistently
      borderRadiusApplication: "end", // Apply only to the top of the stack
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
    },
    yaxis: {
      max:100,
      labels: {
        formatter: (val) => `${Math.round(val)}%`
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      show:false,
      position: "top",
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex, dataPointIndex }) => {
          const rawData = rawSeries[seriesIndex]?.data[dataPointIndex]; // Access the original count
          return `${rawData}`; // Show the count in the tooltip
        },
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
