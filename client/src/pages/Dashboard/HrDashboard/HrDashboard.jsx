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
import PieChartMui from "../../../components/graphs/PieChartMui";

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
      name: "IT Total",
      data: [45, 50, 40, 55, 60, 50, 65, 60, 70, 75, 80, 85],
      group: "total",


    },
    
    {
      name: "Space Total",
      data: [],
      group: "space",
    },
    {
      name: "IT Completed",
      data: [40, 45, 25, 40, 45, 35, 50, 45, 55, 60, 65, 70],
      group: "completed",

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
    colors: ["#80bf01", "#01411C", "#FF0000"], // Colors for the series
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
    { id: 1, name: 'Anushri Bhagat', age: 24,gender:'Female',city:"Marcela" },
    { id: 1, name: 'Aiwin', age: 23,gender:'Male',city:"Panaji" },
    { id: 1, name: 'Allen Silvera', age: 25,gender:'Male',city:"Margao" },
    { id: 1, name: 'Muskan Dodmani', age: 22,gender:'Female',city:"St Inez" },
    { id: 1, name: 'Sankalp Kalangutkar', age: 22,gender:'Male',city:"Margao" },
  ];

  const columns2 = [
    { id: 'date', label: 'Date', align: 'left' },
    { id: 'holiday_event', label: 'Holiday/Event', align: 'center' },
    { id:'region',label:'Region',align:'center'},
    
  ];

  const rows2 = [
    { id: 1, date: '2024-12-10', holiday_event: "Indian Navy day",region:'India'},
    { id: 1, date: '2025-15-08', holiday_event: "Muskan Birthday",region:'India'},
    { id: 1, date: '2025-26-01', holiday_event: "Rebuplic Day",region:'India'},
    { id: 1, date: '2025-01-05', holiday_event: "Labour day",region:'India'},
    { id: 1, date: '2025-14-03', holiday_event: "Holi",region:'India'},
    
  ];

  const columns3 = [
    { id: 'employeeName', label: 'Employee name', align: 'left' },
    { id: 'department', label: 'Department', align: 'center' },
    { id:'Performance (%)',label:'Performance (%)',align:'center'},
    
  ];

  const columns4 = [
    { id: 'employeeName', label: 'Employee name', align: 'left' },
    { id: 'department', label: 'Department', align: 'center' },
    { id:'Performance (%)',label:'Performance (%)',align:'center'},
    
  ];


  const rows3 = [
    { id: 1, employeeName:"Aiwin",department:"Tech","Performance (%)":"97"},
    { id: 1, employeeName:"Allen Silvera",department:"Tech","Performance (%)":"90"},
    { id: 1, employeeName:"Sankalp Kalangutkar",department:"Tech","Performance (%)":"80"},
    
  ];

  const rows4 = [
    { id: 1, employeeName:"Anushri Bhagat",department:"Tech","Performance (%)":"40"},
    { id: 1, employeeName:"Sumera Naik",department:"Tech","Performance (%)":"43"},
    { id: 1, employeeName:"Sunaina Bharve",department:"Tech","Performance (%)":"45"},
    
  ];

  const techIndiaVisitors = [
    { id: 0, value: 40, name: "Male",color:'black' },
    { id: 1, value: 60, name: "Female",color:"pink" },
    
  ];
  const techGoaVisitors = [
    { id: 0, value: 5, label: "Panaji" },
    { id: 1, value: 2, label: "Margao" },
    { id: 2, value: 3, label: "Mapusa" },
    { id: 3, value: 3, label: "Ponda" },
    { id: 4, value: 6, label: "Verna" },
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
          title="Payroll Expense Graph"
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
        <Card icon={<SiCashapp />} title="Finance" route={"finance"}/>,
        <Card icon={<CgWebsite />} title="Performance" route={"#"} />,
        <Card icon={<SiGoogleadsense />} title="Data" route={"data"}/>,
        <Card icon={<MdMiscellaneousServices />} title="Settings" route={"settings"} />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard  title="Active" data="28" description="Current Headcount" />,
        <DataCard  title="Average" data="52K" description="salary" />,
        <DataCard  title="Average" data="25" description="Monthly Employees"/>,
        <DataCard  title="Average" data="4%" description="Monthly Iteration" />,
        <DataCard  title="Average" data="92%" description="Attendance"/>,
        <DataCard  title="Average" data="8.1hr" description="Working Hours"/>,
      ],
    },
    {
      layout:1,
      widgets:[
        <LayerBarGraph
          title="Department Wise Tasks% Vs Achievements in %"
          data={series}
          options={options}
        />,
      ]
    },
    {
      layout : 2,
      heading: " Site Visitor Analytics",
      widgets: [
        
        <PieChartMui
          title={"Gender Data"}
          data={techIndiaVisitors}
        />,
        
        
        <PieChartMui
          title={"City Wise Employees"}
          data={techGoaVisitors}
        />,
        
      ],
    },
    {
      layout:2,
      widgets:[
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
