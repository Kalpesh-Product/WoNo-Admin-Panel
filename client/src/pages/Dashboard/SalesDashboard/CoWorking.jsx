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

  // Original sales data
  const actualSales = [10000, 11000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const projectedSales = [
    10000, 11000, 12000, 10500, 11500, 12500, 13500, 14500, 15500, 16500, 17500,
    18500,
  ];

  // Adjusted projected sales based on carry-forward logic
  let carryForward = 0;
  const adjustedProjectedSales = projectedSales.map((projected, index) => {
    if (months.indexOf(currentMonth) < index) return projected; // Stop adjusting after the current month

    const remainingProjected = Math.max(
      projected + carryForward - actualSales[index],
      0
    ); // Remaining target after actual sales
    carryForward = projected + carryForward - actualSales[index]; // Update carry forward amount

    return remainingProjected; // Adjust projected sales
  });

  // Bar Graph Data (Actual vs. Adjusted Projected Sales)
  const data = [
    { name: "Actual Sales", data: actualSales },
    { name: "Remaining Projected Sales", data: adjustedProjectedSales },
  ];

  // Mock Revenue Data (Replace with actual API response)
  const generateRevenueBreakup = (actualAmount) => {
    if (actualAmount === 0) return [{ revenue: "₹0" }]; // No sales, return empty row

    let remainingAmount = actualAmount;
    const numEntries = Math.floor(Math.random() * 3) + 2; // Between 2 to 4 entries
    const revenueBreakup = [];

    for (let i = 0; i < numEntries - 1; i++) {
      let part = Math.floor(Math.random() * (remainingAmount * 0.6)) + 1000; // Each part between 1000 and 60% of remaining
      remainingAmount -= part;
      revenueBreakup.push({ revenue: `₹${part.toLocaleString()}` });
    }

    // Push the last remaining amount to ensure total matches actual sales
    revenueBreakup.push({ revenue: `₹${remainingAmount.toLocaleString()}` });

    return revenueBreakup;
  };

  // Generate monthly revenue data with breakup
  const modifiedArrayHere = months.map((month, index) => ({
    month,
    actualSales: `₹${actualSales[index].toLocaleString()}`,
    tableData: {
      rows: generateRevenueBreakup(actualSales[index]), // Generate revenue breakup for each month
    },
  }));

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
        data={data}
        options={options}
        height={400}
        year={true}
        customLegend={true}
        firstParam={{
          title: "Actual Sales",
          data: "₹" + data[0].data.reduce((a, b) => a + b, 0),
        }}
        secondParam={{
          title: "Remaining Projected Sales (Adjusted)",
          data: "₹" + data[1].data.reduce((a, b) => a + b, 0),
        }}
      />

      {/* Accordion Section for Monthly Revenue */}
      <div>
        {modifiedArrayHere.map((data, index) => {
          // Calculate total revenue for the month
          const totalRevenue = data.tableData.rows.reduce(
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
                    {data.actualSales}
                  </span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <AgTable
                  data={data.tableData.rows}
                  columns={[{ header: "Revenue", field: "revenue" }]}
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
