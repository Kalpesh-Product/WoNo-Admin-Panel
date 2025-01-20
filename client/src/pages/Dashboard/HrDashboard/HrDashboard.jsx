import React,{useState} from "react";
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
import MuiTable from "../../../components/Tables/MuiTable";

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
        columnWidth: "45%",
        borderRadius:8,
        borderRadiusWhenStacked:'all',
        borderRadiusApplication:'end',
      },
    },
    colors: ["#00FF00", "#0000FF", "#FF0000"], // Colors for the series
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

  const columns = [
    { id: 'name', label: 'Name', align: 'left' },
    { id: 'age', label: 'Age', align: 'center' },
    { id:'gender',label:'gender',align:'center'},
    { id: 'city', label: 'city', align: 'center' },

  ];

  const rows = [
    { id: 1, name: 'John Doe', age: 30,gender:'Male',city:"Panaji" },
    { id: 1, name: 'John Doe', age: 30,gender:'Male',city:"Panaji" },
    { id: 1, name: 'John Doe', age: 30,gender:'Male',city:"Panaji" },
    { id: 1, name: 'John Doe', age: 30,gender:'Male',city:"Panaji" },
  ];

  const columns2 = [
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'holiday_event', label: 'Holiday/Event', align: 'center' },
    { id:'region',label:'Region',align:'center'},
    
  ];

  const rows2 = [
    { id: 1, name: '2024-12-04', holiday_event: "Indian Navy day",region:'India'},
    { id: 1, name: '2024-12-04', holiday_event: "Indian Navy day",region:'India'},
    
  ];


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
          title="Budget v/s Achievements"
          data={data}
          options={optionss}
        />,
      ],
    },
    {
      layout: 6,
      widgets: [
        <Card icon={<CgWebsite />} title="On Boarding" route={"onboarding"} />,
        <Card icon={<LuHardDriveUpload />} title="Compliance" route={"compliances"} />,
        <Card icon={<SiCashapp />} title="Finance" route={"#"}/>,
        <Card icon={<CgWebsite />} title="Performance" route={"#"} />,
        <Card icon={<SiGoogleadsense />} title="Data" route={"data"}/>,
        <Card icon={<MdMiscellaneousServices />} title="Settings" route={"#"} />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard  title="On Boarding" data="28" description="Current Headcount" />,
        <DataCard  title="Compliance" data="52K" description="salary" />,
        <DataCard  title="Finance" data="25" description="Monthly Employees"/>,
        <DataCard  title="Performance" data="4%" description="Monthly Iteration" />,
        <DataCard  title="Data" data="92%" description="Attendance"/>,
        <DataCard  title="Settings" data="8.1hr" description="Working Hours"/>,
      ],
    },
    {
      layout:1,
      widgets:[
        <LayerBarGraph
          title="Department-Wise Task Achievement"
          data={series}
          options={options}
        />,
      ]
    },
    {
      layout:2,
      widgets:[
        <MuiTable
        columns={columns}
        rows={rows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        />,
        <MuiTable
        columns={columns}
        rows={rows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        />,
        <MuiTable
        columns={columns}
        rows={rows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        />,
        <MuiTable
        columns={columns}
        rows={rows}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        />,
      ]

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
