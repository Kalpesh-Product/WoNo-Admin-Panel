import React, { useState } from "react";
import BarGraph from "../../../components/graphs/BarGraph";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import AgTable from "../../../components/AgTable"; // Assuming you have this table component

const CoWorking = () => {
  // Financial Year Months
  const months = [
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
  ];

  // Set the current month for development purposes
  const [currentMonth, setCurrentMonth] = useState("April");

  // Initial Sales Data (Contains both actual and projected sales)
  const initialSalesData = [
    { month: "April", actual: 10000, projected: 10000 },
    { month: "May", actual: 11000, projected: 11000 },
    { month: "June", actual: 0, projected: 12000 },
    { month: "July", actual: 0, projected: 10500 },
    { month: "August", actual: 0, projected: 11500 },
    { month: "September", actual: 0, projected: 12500 },
    { month: "October", actual: 0, projected: 13500 },
    { month: "November", actual: 0, projected: 14500 },
    { month: "December", actual: 0, projected: 15500 },
    { month: "January", actual: 0, projected: 16500 },
    { month: "February", actual: 0, projected: 17500 },
    { month: "March", actual: 0, projected: 18500 },
  ];

  // Carry Forward & Adjusted Projected Sales
  let carryForward = 0;
  const salesData = initialSalesData.map((data, index) => {
    if (months.indexOf(currentMonth) < index)
      return { ...data, adjustedProjected: data.projected }; // Use original projected for future months

    const remainingProjected = Math.max(
      data.projected + carryForward - data.actual,
      0
    );
    carryForward = data.projected + carryForward - data.actual; // Carry forward deficit

    return { ...data, adjustedProjected: remainingProjected ?? 0 }; // Ensure it's never undefined
  });

  // Function to Generate Revenue Breakup for Each Month
  const generateRevenueBreakup = (actualAmount) => {
    if (actualAmount === 0) return [{ client: "No Sales", revenue: "₹0" }]; // No sales case
  
    let remainingAmount = actualAmount;
    const numEntries = Math.floor(Math.random() * 3) + 2; // 2 to 4 entries
    const revenueBreakup = [];
  
    const clientNames = [
      "Client A", "Client B", "Client C", "Client D", "Client E",
      "Client F", "Client G", "Client H", "Client I", "Client J"
    ];
  
    const regions = ["North", "South", "East", "West"]; // Example extra data field
    const industries = ["Retail", "Finance", "Technology", "Healthcare"]; // Example category
  
    for (let i = 0; i < numEntries - 1; i++) {
      let part = Math.floor(Math.random() * (remainingAmount * 0.6)) + 1000;
      remainingAmount -= part;
      revenueBreakup.push({
        client: clientNames[i % clientNames.length], // Assign client names
        revenue: `₹${part.toLocaleString()}`,
        region: regions[i % regions.length], // Random region
        industry: industries[i % industries.length] // Random industry category
      });
    }
  
    // Last entry to ensure total matches actual sales
    revenueBreakup.push({
      client: clientNames[revenueBreakup.length % clientNames.length],
      revenue: `₹${remainingAmount.toLocaleString()}`,
      region: regions[revenueBreakup.length % regions.length],
      industry: industries[revenueBreakup.length % industries.length]
    });
  
    return revenueBreakup;
  };
  
  // Dynamic Table Columns (Easily Add More Fields)
  const tableColumns = [
    { header: "Client Name", field: "client" },
    { header: "Revenue", field: "revenue" },
    { header: "Region", field: "region" }, // Additional column
    { header: "Industry", field: "industry" } // Additional column
  ];
    

  // Prepare Bar Graph Data from salesData
  const graphData = [
    { name: "Actual Sales", data: salesData.map((data) => data.actual) },
    {
      name: "Remaining Projected Sales",
      data: salesData.map((data) => data.adjustedProjected),
    },
  ];

  // ApexCharts options
  const options = {
    chart: { type: "bar", stacked: true },
    xaxis: { categories: months },
    yaxis: { title: { text: "Amount (in Rupees)" } },
    plotOptions: { bar: { horizontal: false, columnWidth: "50%" } },
    legend: { position: "top" },
  };

  return (
    <div>
      {/* Development Purpose: Select Current Month */}
      <div className="mb-4">
        <FormControl size="small">
          <InputLabel>Current Month</InputLabel>
          <Select
            value={currentMonth}
            onChange={(event) => setCurrentMonth(event.target.value)}
            label="Current Month"
          >
            {months.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Bar Graph Component */}
      <BarGraph
        data={graphData}
        options={options}
        height={400}
        year={true}
        customLegend={true}
        firstParam={{
          title: "Actual Sales",
          data: "₹" + graphData[0].data.reduce((a, b) => a + b, 0),
        }}
        secondParam={{
          title: "Remaining Projected Sales (Adjusted)",
          data:
            "₹" + (graphData[1]?.data?.reduce((a, b) => a + (b || 0), 0) || 0),
        }}
      />

      {/* Accordion Section for Monthly Revenue */}
      <div>
        {salesData.map((data, index) => {
          const revenueBreakup = generateRevenueBreakup(data.actual);
          const totalRevenue = revenueBreakup.reduce(
            (sum, rev) => sum + parseInt(rev.revenue.replace(/\u20B9/, ""), 10),
            0
          );

          return (
            <Accordion key={index} className="py-4">
              <AccordionSummary
                expandIcon={<IoIosArrowDown />}
                aria-controls={`panel-${index}-content`}
                id={`panel-${index}-header`}
                className="border-b-[1px] border-borderGray"
              >
                <div className="flex justify-between items-center w-full px-4">
                  <span className="text-subtitle font-medium">
                    {data.month}
                  </span>
                  <span className="text-subtitle font-medium">
                    ₹{data.actual.toLocaleString()}
                  </span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <AgTable
                  data={revenueBreakup}
                  columns={tableColumns}
                  tableHeight={300}
                />
                <span className="block mt-2 font-medium">
                  Total Revenue for {data.month}: ₹
                  {totalRevenue.toLocaleString()}
                </span>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

export default CoWorking;
