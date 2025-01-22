import React from "react";
import LayerBarGraph from "../../../../components/graphs/LayerBarGraph";
import WidgetSection from "../../../../components/WidgetSection";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { IoIosArrowDown } from "react-icons/io";
import AgTable from "../../../../components/AgTable";
import PrimaryButton from "../../../../components/PrimaryButton";

const HrBudget = () => {
  // Data for the chart
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


  // Data array for rendering the Accordion
  const financialData = [
    {
      month: "April 2025",
      amount: "\u20B915000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          {
            id: 1,
            department: "HR",
            payment: `\u20B92500`,
            paymentDate: "2025-04-10",
            status: "Paid",
          },
          {
            id: 2,
            department: "Finance",
            payment: "\u20B92500",
            paymentDate: "2025-04-15",
            status: "Pending",
          },
          {
            id: 3,
            department: "Sales",
            payment: "\u20B92500",
            paymentDate: "2025-04-15",
            status: "Pending",
          },
          {
            id: 4,
            department: "Tech",
            payment: "\u20B92500",
            paymentDate: "2025-04-10",
            status: "Paid",
          },
          {
            id: 5,
            department: "IT",
            payment: "\u20B92500",
            paymentDate: "2025-03-15",
            status: "Pending",
          },
          {
            id: 6,
            department: "Admin",
            payment: "\u20B92500",
            paymentDate: "2025-04-10",
            status: "Pending",
          },
        ],
      },
    },
    {
      month: "May 2025",
      amount: "\u20B945000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          {
            id: 1,
            department: "Marketing",
            payment: "\u20B97500",
            paymentDate: "2025-05-05",
            status: "Paid",
          },
          {
            id: 2,
            department: "Sales",
            payment: "\u20B97500",
            paymentDate: "2025-05-20",
            status: "Pending",
          },
          {
            id: 3,
            department: "Finance",
            payment: "\u20B97500",
            paymentDate: "2025-04-25",
            status: "Pending",
          },
          {
            id: 4,
            department: "Tech",
            payment: "\u20B97500",
            paymentDate: "2025-04-10",
            status: "Paid",
          },
          {
            id: 5,
            department: "IT",
            payment: "\u20B97500",
            paymentDate: "2025-03-15",
            status: "Pending",
          },
          {
            id: 6,
            department: "Admin",
            payment: "\u20B97500",
            paymentDate: "2025-04-10",
            status: "Pending",
          },
        ],
      },
    },
    {
      month: "June 2025",
      amount: "\u20B950,000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          {
            id: 1,
            department: "Marketing",
            payment: "\u20B98,333.3",
            paymentDate: "2025-05-05",
            status: "Paid",
          },
          {
            id: 2,
            department: "Sales",
            payment: "\u20B98,333.3",
            paymentDate: "2025-05-20",
            status: "Pending",
          },
          {
            id: 3,
            department: "Finance",
            payment: "\u20B98,333.3",
            paymentDate: "2025-04-25",
            status: "Pending",
          },
          {
            id: 4,
            department: "Tech",
            payment: "\u20B98,333.3",
            paymentDate: "2025-04-10",
            status: "Paid",
          },
          {
            id: 5,
            department: "IT",
            payment: "\u20B98,333,3",
            paymentDate: "2025-03-15",
            status: "Pending",
          },
          {
            id: 6,
            department: "Admin",
            payment: "\u20B98,333.3",
            paymentDate: "2025-04-10",
            status: "Pending",
          },
        ],
      },
    },
    {
      month: "July 2025",
      amount: "\u20B960,000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          {
            id: 1,
            department: "Marketing",
            payment: "&#837710000",
            paymentDate: "2025-05-05",
            status: "Paid",
          },
          {
            id: 2,
            department: "Sales",
            payment: "&#837710000",
            paymentDate: "2025-05-20",
            status: "Pending",
          },
          {
            id: 3,
            department: "Finance",
            payment: "&#837710000",
            paymentDate: "2025-04-25",
            status: "Pending",
          },
          {
            id: 4,
            department: "Tech",
            payment: "&#837710000",
            paymentDate: "2025-04-10",
            status: "Paid",
          },
          {
            id: 5,
            department: "IT",
            payment: "&#837710000",
            paymentDate: "2025-03-15",
            status: "Pending",
          },
          {
            id: 6,
            department: "Admin",
            payment: "&#837710000",
            paymentDate: "2025-04-10",
            status: "Pending",
          },
        ],
      },
    },
    {
      month: "August 2025",
      amount: "\u20B970000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          {
            id: 1,
            department: "Marketing",
            payment: "\u20B911,666",
            paymentDate: "2025-05-05",
            status: "Paid",
          },
          {
            id: 2,
            department: "Sales",
            payment: "\u20B911,666",
            paymentDate: "2025-05-20",
            status: "Pending",
          },
          {
            id: 3,
            department: "Finance",
            payment: "\u20B911,666",
            paymentDate: "2025-04-25",
            status: "Pending",
          },
          {
            id: 4,
            department: "Tech",
            payment: "\u20B911,666",
            paymentDate: "2025-04-10",
            status: "Paid",
          },
          {
            id: 5,
            department: "IT",
            payment: "\u20B911,666",
            paymentDate: "2025-03-15",
            status: "Pending",
          },
          {
            id: 6,
            department: "Admin",
            payment: "\u20B911,666",
            paymentDate: "2025-04-10",
            status: "Pending",
          },
        ],
      },
    },
    {
      month: "September 2025",
      amount: "\u20B980,000",
      tableData: {
        columns: [
          { field: "department", headerName: "Department", flex: 1 },
          { field: "payment", headerName: "Payment", flex: 1 },
          { field: "paymentDate", headerName: "Payment Date", flex: 1 },
          { field: "status", headerName: "Status", flex: 1 },
        ],
        rows: [
          {
            id: 1,
            department: "Marketing",
            payment: "\u20B913,333.33",
            paymentDate: "2025-05-05",
            status: "Paid",
          },
          {
            id: 2,
            department: "Sales",
            payment: "\u20B913,333.33",
            paymentDate: "2025-05-20",
            status: "Pending",
          },
          {
            id: 3,
            department: "Finance",
            payment: "\u20B913,333.33",
            paymentDate: "2025-04-25",
            status: "Pending",
          },
          {
            id: 4,
            department: "Tech",
            payment: "\u20B913,333.33",
            paymentDate: "2025-04-10",
            status: "Paid",
          },
          {
            id: 5,
            department: "IT",
            payment: "\u20B913,333.33",
            paymentDate: "2025-03-15",
            status: "Pending",
          },
          {
            id: 6,
            department: "Admin",
            payment: "\u20B913,333.33",
            paymentDate: "2025-04-10",
            status: "Pending",
          },
        ],
      },
    },

    // Add more months as needed
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="border-default border-borderGray rounded-md">
        <WidgetSection layout={1} title={"BUDGET 2024"}>
          <LayerBarGraph options={optionss} data={data} />
        </WidgetSection>
      </div>

      <div className="flex flex-col gap-4 border-default border-borderGray rounded-md p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-title font-pmedium text-primary">
              Allocated Budget :{" "}
            </span>
            <span className="text-title font-pmedium">5 Lakhs</span>
          </div>
          <div>
            <PrimaryButton title={"Request Budget"} />
          </div>
        </div>
        <div>
          {financialData.map((data, index) => (
            <Accordion key={index} className="py-4">
              <AccordionSummary
                expandIcon={<IoIosArrowDown />}
                aria-controls={`panel\u20B9{index}-content`}
                id={`panel\u20B9{index}-header`}
                className="border-b-[1px] border-borderGray"
              >
                <div className="flex justify-between items-center w-full px-4">
                  <span className="text-subtitle font-pmedium">
                    {data.month}
                  </span>
                  <span className="text-subtitle font-pmedium">
                    {data.amount}
                  </span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <AgTable
                  search={true}
                  searchColumn={"Department"}
                  tableTitle={`${data.month}`}
                  data={data.tableData.rows}
                  columns={data.tableData.columns}
                  tableHeight={250}
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HrBudget;
