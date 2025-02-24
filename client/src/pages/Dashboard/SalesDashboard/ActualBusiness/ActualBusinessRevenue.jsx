import React, { useState } from "react";
import BarGraph from "../../../../components/graphs/BarGraph";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import AgTable from "../../../../components/AgTable";

const ActualBusinessRevenue = () => {
  const mockBusinessRevenueData = [
    {
      month: "April",
      domains: [
        {
          name: "Co-Working",
          revenue: 12000,
          clients: [
            { client: "Client A", revenue: 5000 },
            { client: "Client B", revenue: 4000 },
            { client: "Client C", revenue: 3000 }
          ]
        },
        {
          name: "Workation",
          revenue: 8000,
          clients: [
            { client: "Client D", revenue: 4000 },
            { client: "Client E", revenue: 4000 }
          ]
        },
        {
          name: "Co-Living",
          revenue: 15000,
          clients: [
            { client: "Client F", revenue: 5000 },
            { client: "Client G", revenue: 7000 },
            { client: "Client H", revenue: 3000 }
          ]
        }
      ]
    },
    {
      month: "May",
      domains: [
        {
          name: "Co-Working",
          revenue: 15000,
          clients: [
            { client: "Client I", revenue: 6000 },
            { client: "Client J", revenue: 5000 },
            { client: "Client K", revenue: 4000 }
          ]
        },
        {
          name: "Workation",
          revenue: 9000,
          clients: [
            { client: "Client L", revenue: 5000 },
            { client: "Client M", revenue: 4000 }
          ]
        },
        {
          name: "Co-Living",
          revenue: 14000,
          clients: [
            { client: "Client N", revenue: 6000 },
            { client: "Client O", revenue: 5000 },
            { client: "Client P", revenue: 3000 }
          ]
        }
      ]
    },
    {
      month: "June",
      domains: [
        {
          name: "Co-Working",
          revenue: 18000,
          clients: [
            { client: "Client Q", revenue: 7000 },
            { client: "Client R", revenue: 6000 },
            { client: "Client S", revenue: 5000 }
          ]
        },
        {
          name: "Workation",
          revenue: 10000,
          clients: [
            { client: "Client T", revenue: 5000 },
            { client: "Client U", revenue: 5000 }
          ]
        },
        {
          name: "Co-Living",
          revenue: 13000,
          clients: [
            { client: "Client V", revenue: 6000 },
            { client: "Client W", revenue: 4000 },
            { client: "Client X", revenue: 3000 }
          ]
        }
      ]
    },
    {
      month: "July",
      domains: [
        {
          name: "Co-Working",
          revenue: 20000,
          clients: [
            { client: "Client Y", revenue: 8000 },
            { client: "Client Z", revenue: 7000 },
            { client: "Client AA", revenue: 5000 }
          ]
        },
        {
          name: "Workation",
          revenue: 11000,
          clients: [
            { client: "Client AB", revenue: 6000 },
            { client: "Client AC", revenue: 5000 }
          ]
        },
        {
          name: "Co-Living",
          revenue: 16000,
          clients: [
            { client: "Client AD", revenue: 7000 },
            { client: "Client AE", revenue: 6000 },
            { client: "Client AF", revenue: 3000 }
          ]
        }
      ]
    }
  ];

  const [selectedMonth, setSelectedMonth] = useState(mockBusinessRevenueData[0].month); // Default to first month

  // Function to update selected month
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Filter data based on selected month
  const selectedMonthData = mockBusinessRevenueData.find((data) => data.month === selectedMonth);

  // Prepare Bar Graph Data
  const graphData = [
    {
      name: "Revenue",
      data: selectedMonthData.domains.map((domain) => domain.revenue)
    }
  ];

  // Graph Options
  const options = {
    chart: { type: "bar", stacked: false },
    xaxis: { categories: selectedMonthData.domains.map((domain) => domain.name) },
    yaxis: { title: { text: "Revenue (in Rupees)" } },
    plotOptions: { bar: { horizontal: false, columnWidth: "20%" } },
    legend: { position: "top" }
  };

  return (
    <div className="p-4">
      {/* Month Selection Dropdown */}
      <div className="mb-4">
        <FormControl size="small">
          <InputLabel>Select Month</InputLabel>
          <Select value={selectedMonth} onChange={handleMonthChange}>
            {mockBusinessRevenueData.map((data) => (
              <MenuItem key={data.month} value={data.month}>
                {data.month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Bar Graph Component */}
      <BarGraph data={graphData} options={options} height={400} title="Domain-wise Revenue" />

      {/* Accordion Section for Domain-wise Revenue Breakdown */}
      <div>
        {selectedMonthData.domains.map((domain, index) => {
          return (
            <Accordion key={index} className="py-4">
              <AccordionSummary
                expandIcon={<IoIosArrowDown />}
                aria-controls={`panel-${index}-content`}
                id={`panel-${index}-header`}
                className="border-b-[1px] border-borderGray"
              >
                <div className="flex justify-between items-center w-full px-4">
                  <span className="text-subtitle font-medium">{domain.name}</span>
                  <span className="text-subtitle font-medium">₹{domain.revenue.toLocaleString()}</span>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <AgTable
                  data={domain.clients}
                  columns={[
                    { header: "Client Name", field: "client",flex:1 },
                    { header: "Revenue", field: "revenue" , flex:1}
                  ]}
                  tableHeight={300}
                />
                <span className="block mt-2 font-medium">
                  Total Revenue for {domain.name}: ₹{domain.revenue.toLocaleString()}
                </span>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

export default ActualBusinessRevenue;
