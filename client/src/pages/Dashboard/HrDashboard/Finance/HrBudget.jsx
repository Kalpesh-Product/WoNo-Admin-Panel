import React from "react";
import GroupedBarGraph from "../../../../components/graphs/GroupedBarGraph";
import WidgetSection from "../../../../components/WidgetSection";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { IoIosArrowDown } from "react-icons/io";
import AgTable from "../../../../components/AgTable";

const HrBudget = () => {
  // Data for the chart
  const allocated = [6, 8, 7, 5, 9, 10, 11, 12, 8, 7, 6, 10];
  const utilized = [5, 7, 6, 4, 8, 9, 10, 11, 7, 6, 5, 12];

  // Generate colors for utilized bars based on the condition
  const utilizedColors = utilized.map(
    (value, index) => (value > allocated[index] ? "#FF0000" : "#90EE90") // Red if exceeded, light green otherwise
  );

  const series = [
    {
      name: "Allocated",
      data: allocated, // Allocated budget for each month
    },
    {
      name: "Utilised",
      data: utilized, // Utilised budget for each month
    },
  ];

  // Chart options
  const options = {
    chart: {
      type: "bar",
      toolbar: {
        show: true,
      },
      fontFamily: "Poppins-Regular",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#ffff"],
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
      title: {
        text: "Months (Financial Year)",
      },
    },
    yaxis: {
      title: {
        text: "Budget (in Lakhs)",
      },
      labels: {
        formatter: (value) => `${value}L`,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} Lakhs`,
      },
    },
    legend: {
      position: "top",
    },
    colors: [
      "#006400", // Dark green for Allocated
      function ({ dataPointIndex }) {
        return utilizedColors[dataPointIndex]; // Dynamically apply color to Utilized bars
      },
    ],
  };

  // Data array for rendering the Accordion
  const financialData = [
    {
      month: "April 2025",
      amount: "$15000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          { id: 1, department: "HR", payment: "$2500", paymentDate: "2025-04-10", status: "Paid" },
          { id: 2, department: "Finance", payment: "$2500", paymentDate: "2025-04-15", status: "Pending" },
          { id: 3, department: "Sales", payment: "$2500", paymentDate: "2025-04-15", status: "Pending" },
          { id: 4, department: "Tech", payment: "$2500", paymentDate: "2025-04-10", status: "Paid" },
          { id: 5, department: "IT", payment: "$2500", paymentDate: "2025-03-15", status: "Pending" },
          { id: 6, department: "Admin", payment: "$2500", paymentDate: "2025-04-10", status: "Pending" },
        ],
      },
    },
    {
      month: "May 2025",
      amount: "$45000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          { id: 1, department: "Marketing", payment: "$7500", paymentDate: "2025-05-05", status: "Paid" },
          { id: 2, department: "Sales", payment: "$7500", paymentDate: "2025-05-20", status: "Pending" },
          { id: 3, department: "Finance", payment: "$7500", paymentDate: "2025-04-25", status: "Pending" },
          { id: 4, department: "Tech", payment: "$7500", paymentDate: "2025-04-10", status: "Paid" },
          { id: 5, department: "IT", payment: "$7500", paymentDate: "2025-03-15", status: "Pending" },
          { id: 6, department: "Admin", payment: "$7500", paymentDate: "2025-04-10", status: "Pending" },
        ],
      },
    },
    {
      month: "June 2025",
      amount: "$50,000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          { id: 1, department: "Marketing", payment: "$8,333.3", paymentDate: "2025-05-05", status: "Paid" },
          { id: 2, department: "Sales", payment: "$8,333.3", paymentDate: "2025-05-20", status: "Pending" },
          { id: 3, department: "Finance", payment: "$8,333.3", paymentDate: "2025-04-25", status: "Pending" },
          { id: 4, department: "Tech", payment: "$8,333.3", paymentDate: "2025-04-10", status: "Paid" },
          { id: 5, department: "IT", payment: "$8,333,3", paymentDate: "2025-03-15", status: "Pending" },
          { id: 6, department: "Admin", payment: "$8,333.3", paymentDate: "2025-04-10", status: "Pending" },
        ],
      },

    },
    {
      month: "July 2025",
      amount: "$60,000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          { id: 1, department: "Marketing", payment: "$10000", paymentDate: "2025-05-05", status: "Paid" },
          { id: 2, department: "Sales", payment: "$10000", paymentDate: "2025-05-20", status: "Pending" },
          { id: 3, department: "Finance", payment: "$10000", paymentDate: "2025-04-25", status: "Pending" },
          { id: 4, department: "Tech", payment: "$10000", paymentDate: "2025-04-10", status: "Paid" },
          { id: 5, department: "IT", payment: "$10000", paymentDate: "2025-03-15", status: "Pending" },
          { id: 6, department: "Admin", payment: "$10000", paymentDate: "2025-04-10", status: "Pending" },
        ],
      },

    },
    {
      month: "August 2025",
      amount: "$70000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          { id: 1, department: "Marketing", payment: "$11,666", paymentDate: "2025-05-05", status: "Paid" },
          { id: 2, department: "Sales", payment: "$11,666", paymentDate: "2025-05-20", status: "Pending" },
          { id: 3, department: "Finance", payment: "$11,666", paymentDate: "2025-04-25", status: "Pending" },
          { id: 4, department: "Tech", payment: "$11,666", paymentDate: "2025-04-10", status: "Paid" },
          { id: 5, department: "IT", payment: "$11,666", paymentDate: "2025-03-15", status: "Pending" },
          { id: 6, department: "Admin", payment: "$11,666", paymentDate: "2025-04-10", status: "Pending" },
        ],
      },

    },
    {
      month: "September 2025",
      amount: "$80,000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          { id: 1, department: "Marketing", payment: "$13,333.33", paymentDate: "2025-05-05", status: "Paid" },
          { id: 2, department: "Sales", payment: "$13,333.33", paymentDate: "2025-05-20", status: "Pending" },
          { id: 3, department: "Finance", payment: "$13,333.33", paymentDate: "2025-04-25", status: "Pending" },
          { id: 4, department: "Tech", payment: "$13,333.33", paymentDate: "2025-04-10", status: "Paid" },
          { id: 5, department: "IT", payment: "$13,333.33", paymentDate: "2025-03-15", status: "Pending" },
          { id: 6, department: "Admin", payment: "$13,333.33", paymentDate: "2025-04-10", status: "Pending" },
        ],
      },

    },
    
  
    

    

    // Add more months as needed
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="border-default border-borderGray rounded-md">
        <WidgetSection layout={1} title={"BUDGET 2025"}>
          <GroupedBarGraph options={options} series={series} />
        </WidgetSection>
      </div>

      <div>
        {financialData.map((data, index) => (
          <Accordion key={index} className="py-4">
            <AccordionSummary
              expandIcon={<IoIosArrowDown />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              className="border-b-[1px] border-borderGray"
            >
              <div className="flex justify-between items-center w-full px-4">
                <span>{data.month}</span>
                <span>{data.amount}</span>
              </div>
            </AccordionSummary>
            <AccordionDetails>
            <AgTable
              search={true}
              searchColumn={"Department"}
              tableTitle={`Budget Details for ${data.month}`}
              data={data.tableData.rows}
              columns={data.tableData.columns}
              tableHeight={250}
            />
          </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default HrBudget;
