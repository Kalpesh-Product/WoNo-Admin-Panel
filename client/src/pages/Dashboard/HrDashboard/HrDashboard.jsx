import React, { useState } from "react";
import WidgetSection from "../../../components/WidgetSection";
import LayerBarGraph from "../../../components/graphs/LayerBarGraph";
import Card from "../../../components/Card";
import { LuHardDriveUpload } from "react-icons/lu";
import { CgWebsite } from "react-icons/cg";
import { SiCashapp } from "react-icons/si";
import { SiGoogleadsense } from "react-icons/si";
import { MdMiscellaneousServices } from "react-icons/md";
import DataCard from "../../../components/DataCard";
import PayRollExpenseGraph from "../../../components/HrDashboardGraph/PayRollExpenseGraph";
import MuiTable from "../../../components/Tables/MuiTable";
import PieChartMui from "../../../components/graphs/PieChartMui";

const HrDashboard = () => {
  const rawSeries = [
    {
      name: "Sales Total",
      data: [40, 45, 35, 50, 55, 45, 60, 55, 65, 70, 0, 0],
      group: "total",
    },
    {
      name: "IT Total",
      data: [40, 45, 35, 50, 55, 45, 60, 55, 65, 70, 0, 0],
      group: "total",
    },
    {
      name: "Tech Total",
      data: [45, 50, 40, 55, 60, 50, 65, 60, 70, 75, 0, 0],
      group: "total",
    },

    {
      name: "Admin Total",
      data: [45, 50, 40, 55, 60, 50, 65, 60, 70, 75, 0, 0],
      group: "total",
    },
    {
      name: "Maintainance Total",
      data: [45, 50, 40, 55, 60, 50, 65, 60, 70, 75, 0, 0],
      group: "total",
    },
    {
      name: "Space Completed",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      group: "space",
    },
    {
      name: "Sales Completed",
      data: [40, 45, 25, 40, 45, 35, 50, 45, 55, 60, 0, 0],
      group: "completed",
    },
    {
      name: "IT Completed",
      data: [40, 45, 25, 40, 45, 35, 50, 45, 55, 60, 0, 0],
      group: "completed",
    },

    {
      name: "Tech Completed",
      data: [45, 40, 30, 45, 50, 40, 55, 50, 60, 65, 0, 0],
      group: "completed",
    },
    {
      name: "Admin Completed",
      data: [40, 30, 40, 52, 46, 40, 60, 59, 50, 70, 0, 0],
      group: "completed",
    },
    {
      name: "Maintainance Completed",
      data: [45, 50, 40, 55, 60, 50, 65, 60, 70, 75, 0, 0],
      group: "completed",
    },
  ];

  // Normalize to percentage
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

  // Adjust data for spacing
  const adjustDataWithSpacing = (series) => {
    const adjustedSeries = [];
    const groups = [...new Set(series.map((s) => s.group))];
    groups.forEach((group) => {
      const groupSeries = series.filter((s) => s.group === group);
      groupSeries.forEach((s) => {
        adjustedSeries.push({
          ...s,
          data: s.data.map((val) => (val === 0 ? null : val)),
        });
      });
    });
    return adjustedSeries;
  };

  // Generate colors
  const generateColorsWithSpacing = (series) => {
    const departmentColorMapping = {
      Sales: "#4DA5C5",
      IT: "#4591AD",
      Tech: "#95B4C6", // Red
      Admin: "#608EA9",
      Maintainance: "#87C7DE",
      Space: "#FFA500", // Orange
    };

    return series.map((s) => {
      const department = s.name.split(" ")[0];
      return departmentColorMapping[department] || "#000000";
    });
  };

  // Generate colors and adjusted series
  const colors = generateColorsWithSpacing(rawSeries);
  const adjustedSeries = adjustDataWithSpacing(rawSeries);

  // Extract custom legend items for "Total" series
  const customLegendItems = rawSeries
    .filter((series) => series.group === "total") // Filter only "Total" group
    .map((series) => series.name.split(" ")[0]); // Extract department name (e.g., "Sales", "IT")

  const colorsForLegend = rawSeries
    .filter((series) => series.group === "total") // Filter only "Total" group
    .map((series, index) => colors[index]); // Use the same colors for "Total" series

  // Normalize data
  const series = normalizeToPercentage(adjustedSeries);

  const options = {
    chart: {
      type: "bar",
      stacked: true,
      fontFamily: "Poppins-Regular, Arial, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "65%",
        borderRadius: [5],
        borderRadiusWhenStacked: "all",
        borderRadiusApplication: "end",
      },
    },
    colors, // Use generated colors
    dataLabels: {
      enabled: true, // Enable data labels
      formatter: function (val, opts) {
        const rawData = rawSeries[opts.seriesIndex]?.data[opts.dataPointIndex];
        return rawData ? `${rawData}` : ""; // Display the raw value
      },
      style: {
        fontSize: "9px",
        fontFamily: "Poppins-Regular, Arial, sans-serif",
        colors: ["#00000"], // Color of the data labels
      },
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
      max: 100,
      labels: {
        formatter: (val) => `${Math.round(val)}%`,
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      show: false,
    },

    tooltip: {
      y: {
        formatter: (val, { seriesIndex, dataPointIndex }) => {
          const rawData = rawSeries[seriesIndex]?.data[dataPointIndex];
          return `${rawData}`;
        },
      },
    },
  };

  //firstgraph

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

  const optionss = {
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
    colors: ["#01bf50", "#01411C", "#FF0000"], // Colors for the series
    dataLabels: {
      enabled: true,
      fontSize: "10px",
      fontSize: "10px",
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
      shared: true, // Ensure all series values are shown together
      intersect: false, // Avoid showing individual values for each series separately
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const utilised = utilisedData[dataPointIndex] || 0;
        const exceeded = exceededData[dataPointIndex] || 0;
        const defaultVal = defaultData[dataPointIndex] || 0;

        // Custom tooltip HTML
        return `
        <div style="padding: 10px; font-size: 12px; line-height: 1.5; text-align: left;">
          <strong style="display: block; text-align: center; margin-bottom: 8px;">
            ${w.globals.labels[dataPointIndex]}
          </strong>
          <div style="display: flex; gap:3rem;">
            <span style="flex: 1; text-align: left;">Default Budget:</span>
            <span style="flex: 1; text-align: right;">100%</span>
          </div>
          <div style="display: flex; gap:3rem;">
            <span style="flex: 1; text-align: left;">Utilized Budget:</span>
            <span style="flex: 1; text-align: right;">${utilised}%</span>
          </div>
          <div style="display: flex; gap:3rem;">
            <span style="flex: 1; text-align: left;">Exceeded Budget:</span>
            <span style="flex: 1; text-align: right;">${exceeded}%</span>
          </div>
        </div>
      `;
      },
    },

    legend: {
      show: true,
      position: "top",
    },
  };

  const columns = [
    { id: "name", label: "Name", align: "left" },
    { id: "age", label: "Age", align: "center" },
    { id: "gender", label: "gender", align: "center" },
    { id: "city", label: "city", align: "center" },
  ];

  const rows = [
    {
      id: 1,
      name: "Anushri Bhagat",
      age: 24,
      gender: "Female",
      city: "Marcela",
    },
    { id: 1, name: "Aiwin", age: 23, gender: "Male", city: "Panaji" },
    { id: 1, name: "Allen Silvera", age: 25, gender: "Male", city: "Margao" },
    {
      id: 1,
      name: "Muskan Dodmani",
      age: 22,
      gender: "Female",
      city: "St Inez",
    },
    {
      id: 1,
      name: "Sankalp Kalangutkar",
      age: 22,
      gender: "Male",
      city: "Margao",
    },
  ];

  const columns2 = [
    { id: "date", label: "Date", align: "left" },
    { id: "holiday_event", label: "Holiday/Event", align: "center" },
    { id: "region", label: "Region", align: "center" },
  ];

  const rows2 = [
    {
      id: 1,
      date: "2024-12-10",
      holiday_event: "Indian Navy day",
      region: "India",
    },
    {
      id: 1,
      date: "2025-24-01",
      holiday_event: "Republic day Celebrations",
      region: "India",
    },
    {
      id: 1,
      date: "2025-26-01",
      holiday_event: "Rebuplic Day",
      region: "India",
    },
    {
      id: 1,
      date: "2025-10-03",
      holiday_event: "Maha Shiv-ratri",
      region: "India",
    },
    { id: 1, date: "2025-14-03", holiday_event: "Holi", region: "India" },
  ];

  const columns3 = [
    { id: "employeeName", label: "Employee name", align: "left" },
    { id: "department", label: "Department", align: "center" },
    { id: "Performance (%)", label: "Performance (%)", align: "center" },
  ];

  const columns4 = [
    { id: "employeeName", label: "Employee name", align: "left" },
    { id: "department", label: "Department", align: "center" },
    { id: "Performance (%)", label: "Performance (%)", align: "center" },
  ];

  const rows3 = [
    {
      id: 1,
      employeeName: "Aiwin",
      department: "Tech",
      "Performance (%)": "97",
    },
    {
      id: 1,
      employeeName: "Allen Silvera",
      department: "Tech",
      "Performance (%)": "90",
    },
    {
      id: 1,
      employeeName: "Sankalp Kalangutkar",
      department: "Tech",
      "Performance (%)": "80",
    },
  ];

  const rows4 = [
    {
      id: 1,
      employeeName: "Anushri Bhagat",
      department: "Tech",
      "Performance (%)": "40",
    },
    {
      id: 1,
      employeeName: "Sumera Naik",
      department: "Tech",
      "Performance (%)": "43",
    },
    {
      id: 1,
      employeeName: "Sunaina Bharve",
      department: "Tech",
      "Performance (%)": "45",
    },
  ];

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
  
  const genderData = [
    {
      id: 0,
      value: ((maleCount / totalUsers) * 100).toFixed(2),
      actualCount: maleCount,
      label: "Male",
      color: "#0056B3",
    },
    {
      id: 1,
      value: ((femaleCount / totalUsers) * 100).toFixed(2),
      actualCount: femaleCount,
      label: "Female",
      color: "#FD507E",
    },
  ];

  const genderPieChart = {
    chart: {
      type: "pie",
    },
    labels: ["Male", "Female"], // Labels for the pie slices
    colors: ["#0056B3", "#FD507E"], // Pass colors as an array
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px", // Adjust the font size of the labels
        fontWeight: "bold",
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: "#000",
        opacity: 0.45,
      },
      formatter: function (val) {
        return `${val.toFixed(0)}%`; // Show percentage value in the center
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex }) {
        const item = genderData[seriesIndex]; // Use genderData to fetch the correct item
        return `
          <div style="padding: 5px; font-size: 12px;">
            ${item.label}: ${item.actualCount} employees
          </div>`;
      },
    },
    legend: {
      position: "right",
      horizontalAlign: "center",
    },
  };

  //First pie-chart config data end

//Second pie-chart config data start
const techGoaVisitors = [
  { id: 0, value: 5, label: "Panaji", color: "#4A90E2" }, // Light Blue
  { id: 1, value: 2, label: "Margao", color: "#007AFF" }, // Medium Blue
  { id: 2, value: 3, label: "Mapusa", color: "#0056B3" }, // Dark Blue
  { id: 3, value: 3, label: "Ponda", color: "#1E90FF" }, // Dodger Blue
  { id: 4, value: 6, label: "Verna", color: "#87CEFA" }, // Sky Blue
];

const techGoaVisitorsOptions = {
  chart: {
    type: "pie",
  },
  labels: techGoaVisitors.map((item) => item.label), // Labels for the pie slices
  colors: techGoaVisitors.map((item) => item.color), // Assign colors to slices
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "14px",
      fontWeight: "bold",
    },
    formatter: function (val) {
      return `${val.toFixed(0)}%`; // Show percentage value
    },
  },
  tooltip: {
    enabled: true,
    custom: function ({ series, seriesIndex }) {
      const item = techGoaVisitors[seriesIndex]; // Access the correct item
      return `
        <div style="padding: 5px; font-size: 12px;">
          ${item.label}: ${item.value} visitors
        </div>`;
    },
  },
  legend: {
    position: "right",
    horizontalAlign: "center",
  },
};



  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const hrWidgets = [
    {
      layout: 1,
      widgets: [
        <LayerBarGraph
          title="Payroll Expense Graph"
          data={data}
          options={optionss}
        />,
      ],
    },
    {
      layout: 6,
      widgets: [
        <Card icon={<CgWebsite />} title="Employee" route={"employee"} />,
        <Card
          icon={<LuHardDriveUpload />}
          title="Company"
          route={"company"}
        />,
        <Card icon={<SiCashapp />} title="Finance" route={"finance"} />,
        <Card icon={<CgWebsite />} title="Mix Bag" route={"#"} />,
        <Card icon={<SiGoogleadsense />} title="Data" route={"data"} />,
        <Card
          icon={<MdMiscellaneousServices />}
          title="Settings"
          route={"settings"}
        />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard title="Active" data="28" description="Current Headcount" />,
        <DataCard title="Average" data="52K" description="salary" />,
        <DataCard title="Average" data="25" description="Monthly Employees" />,
        <DataCard title="Average" data="4%" description="Monthly Iteration" />,
        <DataCard title="Average" data="92%" description="Attendance" />,
        <DataCard title="Average" data="8.1hr" description="Working Hours" />,
      ],
    },
    {
      layout: 1,
      widgets: [
        <LayerBarGraph
          title="Department Wise Tasks% Vs Achievements in %"
          data={series}
          options={options}
        />,
      ],
    },
    {
      layout: 2,
      heading: "Site Visitor Analytics",
      widgets: [
        <PieChartMui
      percent={true} // Enable percentage display
      title={"Gender Distribution"}
      data={genderData} // Pass processed data
      options={genderPieChart}
    />,
        <PieChartMui
      percent={true} // Enable percentage display
      title={"City Wise Employees"}
      data={techGoaVisitors} // Pass processed data
      options={techGoaVisitorsOptions}
    />,
      ],
    },
    {
      layout: 2,
      widgets: [
        <MuiTable
          Title="Current Months Birthday List"
          columns={columns}
          rows={rows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />,
        <MuiTable
          Title="Current Months Holidays and Events List"
          columns={columns2}
          rows={rows2}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />,
        <MuiTable
          Title="Top 3 Performers"
          columns={columns3}
          rows={rows3}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />,
        <MuiTable
          Title="Under 3 Performed List"
          columns={columns4}
          rows={rows4}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />,
      ],
    },
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
