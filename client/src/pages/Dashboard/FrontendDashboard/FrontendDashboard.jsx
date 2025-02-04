import Card from "../../../components/Card";
import React from "react";
import { useLocation } from "react-router-dom";
import LayerBarGraph from "../../../components/graphs/LayerBarGraph";
import WidgetSection from "../../../components/WidgetSection";
import { MdRebaseEdit } from "react-icons/md";
import { LuHardDriveUpload } from "react-icons/lu";
import { CgWebsite } from "react-icons/cg";
import DataCard from "../../../components/DataCard";
import { SiCashapp } from "react-icons/si";
import { SiGoogleadsense } from "react-icons/si";
import { MdMiscellaneousServices } from "react-icons/md";
import BarGraph from "../../../components/graphs/BarGraph";
import PieChartMui from "../../../components/graphs/PieChartMui";
import LineGraph from "../../../components/graphs/LineGraph";

const FrontendDashboard = () => {
  const location = useLocation(); //will need to change useLocation and use context for content rendering once the auth is done

  // Data and calculations
  const utilisedData = [125, 150, 99, 85, 70, 50, 80, 95, 100, 65, 50, 120];
  const defaultData = utilisedData.map((value) =>
    Math.max(100 - Math.min(value, 100), 0)
  );
  const utilisedStack = utilisedData.map((value) => Math.min(value, 100));
  const exceededData = utilisedData.map((value) =>
    value > 100 ? value - 100 : 0
  );

  const data = [
    { name: "Utilised Budget", data: utilisedStack },
    { name: "Default Budget", data: defaultData },
    { name: "Exceeded Budget", data: exceededData },
  ];

  const options = {
    chart: {
      type: "bar",
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        borderRadius: 3,
        borderRadiusWhenStacked: "all",
        borderRadiusApplication: "end",
      },
    },
    colors: ["#27C96A", "#275D3E", "#FF0000"], // Colors for the series
    dataLabels: {
      enabled: true,
      formatter: (value, { seriesIndex }) => {
        if (seriesIndex === 1) return "";
        return `${value}%`;
      },
    },
    xaxis: {
      categories: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    yaxis: {
      max: 150,
      labels: {
        formatter: (value) => `${value}%`,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
      },
    },
    legend: {
      show: true,
      position: "top",
    },
  };

  const users = [
    { name: "John", gender: "Male" },
    { name: "Alice", gender: "Female" },
    { name: "Bob", gender: "Male" },
    { name: "Eve", gender: "Female" },
    { name: "Charlie", gender: "Male" },
    { name: "Charlie", gender: "Male" },
    { name: "Diana", gender: "Female" },
    { name: "Diana", gender: "Female" },
    { name: "Mark", gender: "Male" },
    { name: "James", gender: "Male" },
  ];

  // Calculate total and gender-specific counts
  const totalUsers = users.length;
  const maleCount = users.filter((user) => user.gender === "Male").length;
  const femaleCount = users.filter((user) => user.gender === "Female").length;

  const siteVisitorsData = [
    {
      name: "Site Visitors",
      data: [120, 100, 90, 110, 130, 80, 95, 105, 115, 125, 135, 140], // Monthly counts
    },
  ];

  // Chart options
  const siteVisitorOptions = {
    chart: {
      fontFamily: "Poppins-Regular",
      id: "site-visitors-bar",
      toolbar: { show: false },
    },
    xaxis: {
      categories: [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
      ], // Financial year months
    },
    yaxis: {
      title: {
        text: "Visitors Count",
      },
      min: 0,
      max: 140,
      tickAmount: 7, // 0, 20, 40, ... 140
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: "35%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: "dark",
    },
  };

  const nationWiseData = [
    { id: 0, value: 30, actualCount: 300, label: "Mumbai", color: "#0056B3" },
    { id: 1, value: 20, actualCount: 200, label: "Delhi", color: "#FD507E" },
    {
      id: 2,
      value: 15,
      actualCount: 150,
      label: "Bangalore",
      color: "#FFB900",
    },
    {
      id: 3,
      value: 10,
      actualCount: 100,
      label: "Hyderabad",
      color: "#00A36C",
    },
    { id: 4, value: 8, actualCount: 80, label: "Chennai", color: "#9C27B0" },
    { id: 5, value: 7, actualCount: 70, label: "Kolkata", color: "#E91E63" },
    { id: 6, value: 5, actualCount: 50, label: "Pune", color: "#FF5733" },
    { id: 7, value: 5, actualCount: 50, label: "Ahmedabad", color: "#009688" },
  ];

  // Updated Pie Chart Configuration
  const nationWisePieChart = {
    chart: {
      type: "pie",
    },
    labels: nationWiseData.map((item) => item.label),
    colors: nationWiseData.map((item) => item.color),
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${val.toFixed(0)}%`; // Display percentage
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex }) {
        const item = nationWiseData[seriesIndex];
        return `
          <div style="padding: 5px; font-size: 12px;">
            ${item.label}: ${item.actualCount} visitors
          </div>`;
      },
    },
    legend: {
      position: "right",
      horizontalAlign: "center",
    },
  };

  //Line Graph data

  const totalIssues = [50, 75, 60, 65, 55, 50, 58, 80, 67, 45, 60, 75];
  const resolvedIssues = [40, 70, 50, 60, 45, 40, 50, 70, 60, 40, 55, 70];

  // Calculate percentage of resolved issues
  const resolvedPercentage = totalIssues.map((total, index) => {
    return ((resolvedIssues[index] / total) * 100).toFixed(2); // Convert to percentage
  });

  const websiteIssuesOptions = {
    chart: {
      id: "website-resolved-issues",
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "Poppins-Regular",
    },
    stroke: {
      width: 4,
    },
    markers: {
      size: 6,
      colors: ["#0056B3"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    xaxis: {
      categories: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    },
    yaxis: {
      title: {
        text: "Resolved Percentage (%)",
      },
      labels: {
        formatter: (value) => `${value}%`,
      },
      min: 0,
      max: 100,
      tickAmount: 5, // 0, 20, 40, 60, 80, 100
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        return `<div style="padding: 8px; font-size: 12px;">
          <strong>Resolved Percentage:</strong> ${resolvedPercentage[dataPointIndex]}%<br />
          <strong>Total Issues:</strong> ${totalIssues[dataPointIndex]}<br />
          <strong>Resolved Issues:</strong> ${resolvedIssues[dataPointIndex]}
        </div>`;
      },
    },
    legend: {
      show: true, // No need for legend since only one line is displayed
    },
  };

  const websiteIssuesData = [
    {
      name: "Resolved Percentage",
      data: resolvedPercentage,
      color: "#0056B3",
    },
  ];

  const goaDistrictData = [
    { id: 0, value: 40, actualCount: 400, label: "Panaji", color: "#0056B3" },
    { id: 1, value: 25, actualCount: 250, label: "Margao", color: "#FD507E" },
    { id: 2, value: 15, actualCount: 150, label: "Mapusa", color: "#FFB900" },
    { id: 3, value: 10, actualCount: 100, label: "Pernem", color: "#00A36C" },
    { id: 4, value: 10, actualCount: 100, label: "Vasco", color: "#9C27B0" },
  ];

  // Updated Pie Chart Configuration for Goa Districts
  const goaDistrictPieChart = {
    chart: {
      type: "pie",
    },
    labels: goaDistrictData.map((item) => item.label),
    colors: goaDistrictData.map((item) => item.color),
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${val.toFixed(0)}%`; // Display percentage
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex }) {
        const item = goaDistrictData[seriesIndex];
        return `
          <div style="padding: 5px; font-size: 12px;">
            ${item.label}: ${item.actualCount} visitors
          </div>`;
      },
    },
    legend: {
      position: "right",
      horizontalAlign: "center",
    },
  };

  const techWidgets = [
    {
      layout: 1,
      widgets: [
        <LayerBarGraph
          title="Budget v/s Achievements"
          data={data}
          options={options}
        />,
      ],
    },
    {
      layout: 6,
      widgets: [
        <Card icon={<MdRebaseEdit />} title="Edit Live Theme" />,
        <Card icon={<LuHardDriveUpload />} title="Upload Website" />,
        <Card icon={<CgWebsite />} title="New Themes" />,
        <Card icon={<SiCashapp />} title="Finance" route={"finance"} />,
        <Card icon={<SiGoogleadsense />} title="Data" route={"data"} />,
        <Card icon={<MdMiscellaneousServices />} title="Miscellaneous" />,
      ],
    },
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={1} title={"Website Issues Raised"} border>
          <LineGraph options={websiteIssuesOptions} data={websiteIssuesData} />
        </WidgetSection>
      ],
    },
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={1} border title={"Site Visitors"}>
          <BarGraph data={siteVisitorsData} options={siteVisitorOptions} />
        </WidgetSection>,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection layout={1} border title={"Site Visitors"}>
          <PieChartMui
            percent={true} // Enable percentage display
            data={nationWiseData} // Pass processed data
            options={nationWisePieChart}
          />
        </WidgetSection>,
        <WidgetSection layout={1} border title={"Site Visitors"}>
          <PieChartMui
            percent={true} // Enable percentage display
            data={goaDistrictData} // Pass processed data
            options={goaDistrictPieChart}
          />
        </WidgetSection>,
      ],
    },
  ];

  return (
    <div>
      {techWidgets.map((section, index) => (
        <WidgetSection key={index} layout={section?.layout}>
          {section?.widgets}
        </WidgetSection>
      ))}
    </div>
  );
};

export default FrontendDashboard;
