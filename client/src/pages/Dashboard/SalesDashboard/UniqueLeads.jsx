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
import AgTable from "../../../components/AgTable";
import WidgetSection from "../../../components/WidgetSection";

const UniqueLeads = () => {
  const mockBusinessRevenueData = [
    {
      month: "April",
      domains: [
        {
          name: "Co-Working",
          revenue: 12000,
          clients: [
            {
              client: "Google",
              representative: "John Doe",
              callDate: "2024-04-02",
              status: "Closed",
            },
            {
              client: "Meta",
              representative: "Jane Smith",
              callDate: "2024-04-04",
              status: "Follow-Up",
            },
            {
              client: "Apple",
              representative: "Mike Johnson",
              callDate: "2024-04-10",
              status: "Pending",
            },
          ],
        },
        {
          name: "Workation",
          revenue: 8000,
          clients: [
            {
              client: "Amazon",
              representative: "Chris Evans",
              callDate: "2024-04-05",
              status: "Closed",
            },
            {
              client: "Microsoft",
              representative: "Sophia Williams",
              callDate: "2024-04-09",
              status: "Pending",
            },
            {
              client: "Tesla",
              representative: "Ralph Williams",
              callDate: "2024-04-09",
              status: "Pending",
            },
            {
              client: "Samsung",
              representative: "Tom Harris",
              callDate: "2024-04-09",
              status: "Pending",
            },
          ],
        },
        {
          name: "Co-Living",
          revenue: 15000,
          clients: [
            {
              client: "Nike",
              representative: "Emma Brown",
              callDate: "2024-04-06",
              status: "Closed",
            },
            {
              client: "Sony",
              representative: "Liam Wilson",
              callDate: "2024-04-11",
              status: "Follow-Up",
            },
            {
              client: "PayPal",
              representative: "Olivia Taylor",
              callDate: "2024-04-15",
              status: "Pending",
            },
          ],
        },
      ],
    },
    {
      month: "May",
      domains: [
        {
          name: "Co-Working",
          revenue: 15000,
          clients: [
            {
              client: "Client I",
              representative: "Noah Anderson",
              callDate: "2024-05-01",
              status: "Closed",
            },
            {
              client: "Client J",
              representative: "Charlotte White",
              callDate: "2024-05-05",
              status: "Follow-Up",
            },
            {
              client: "Client K",
              representative: "James Miller",
              callDate: "2024-05-10",
              status: "Pending",
            },
          ],
        },
        {
          name: "Workation",
          revenue: 9000,
          clients: [
            {
              client: "Client L",
              representative: "Lucas Scott",
              callDate: "2024-05-08",
              status: "Closed",
            },
            {
              client: "Client M",
              representative: "Mia Davis",
              callDate: "2024-05-12",
              status: "Pending",
            },
          ],
        },
        {
          name: "Co-Living",
          revenue: 14000,
          clients: [
            {
              client: "Client N",
              representative: "Isabella Moore",
              callDate: "2024-05-07",
              status: "Closed",
            },
            {
              client: "Client O",
              representative: "Elijah Carter",
              callDate: "2024-05-14",
              status: "Follow-Up",
            },
            {
              client: "Client P",
              representative: "Amelia Hall",
              callDate: "2024-05-18",
              status: "Pending",
            },
          ],
        },
      ],
    },
    {
      month: "June",
      domains: [
        {
          name: "Co-Working",
          revenue: 18000,
          clients: [
            {
              client: "Client Q",
              representative: "Ethan Adams",
              callDate: "2024-06-02",
              status: "Closed",
            },
            {
              client: "Client R",
              representative: "Ava Thomas",
              callDate: "2024-06-06",
              status: "Follow-Up",
            },
            {
              client: "Client S",
              representative: "Mason Gonzalez",
              callDate: "2024-06-10",
              status: "Pending",
            },
          ],
        },
        {
          name: "Workation",
          revenue: 10000,
          clients: [
            {
              client: "Client T",
              representative: "Harper Wilson",
              callDate: "2024-06-07",
              status: "Closed",
            },
            {
              client: "Client U",
              representative: "Oliver Martinez",
              callDate: "2024-06-12",
              status: "Pending",
            },
          ],
        },
        {
          name: "Co-Living",
          revenue: 13000,
          clients: [
            {
              client: "Client V",
              representative: "Sophia King",
              callDate: "2024-06-09",
              status: "Closed",
            },
            {
              client: "Client W",
              representative: "Henry Cooper",
              callDate: "2024-06-14",
              status: "Follow-Up",
            },
            {
              client: "Client X",
              representative: "Ella Robinson",
              callDate: "2024-06-18",
              status: "Pending",
            },
          ],
        },
      ],
    },
    {
      month: "July",
      domains: [
        {
          name: "Co-Working",
          revenue: 20000,
          clients: [
            {
              client: "Client Y",
              representative: "Jack Harris",
              callDate: "2024-07-02",
              status: "Closed",
            },
            {
              client: "Client Z",
              representative: "Aria Foster",
              callDate: "2024-07-06",
              status: "Follow-Up",
            },
            {
              client: "Client AA",
              representative: "Logan Murphy",
              callDate: "2024-07-10",
              status: "Pending",
            },
          ],
        },
        {
          name: "Workation",
          revenue: 11000,
          clients: [
            {
              client: "Client AB",
              representative: "Lily Peterson",
              callDate: "2024-07-05",
              status: "Closed",
            },
            {
              client: "Client AC",
              representative: "Sebastian Jenkins",
              callDate: "2024-07-12",
              status: "Pending",
            },
          ],
        },
        {
          name: "Co-Living",
          revenue: 16000,
          clients: [
            {
              client: "Client AD",
              representative: "Zoe Rogers",
              callDate: "2024-07-09",
              status: "Closed",
            },
            {
              client: "Client AE",
              representative: "David Bryant",
              callDate: "2024-07-14",
              status: "Follow-Up",
            },
            {
              client: "Client AF",
              representative: "Natalie Reed",
              callDate: "2024-07-18",
              status: "Pending",
            },
          ],
        },
      ],
    },
  ];

  const [viewType, setViewType] = useState("month"); // 'month' or 'year'
  const [selectedMonth, setSelectedMonth] = useState(
    mockBusinessRevenueData[0].month
  );

  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const selectedMonthData = mockBusinessRevenueData.find(
    (data) => data.month === selectedMonth
  );

  // Aggregate yearly revenue for each domain
  const yearlyRevenueData = {};
  mockBusinessRevenueData.forEach((monthData) => {
    monthData.domains.forEach((domain) => {
      if (!yearlyRevenueData[domain.name]) {
        yearlyRevenueData[domain.name] = { revenue: 0, clients: [] };
      }
      yearlyRevenueData[domain.name].revenue += domain.revenue;
      yearlyRevenueData[domain.name].clients.push(...domain.clients);
    });
  });

  // Prepare Graph Data
  const graphData = [
    {
      name: "Revenue",
      data:
        viewType === "month"
          ? selectedMonthData.domains.map((domain) => domain.revenue)
          : Object.values(yearlyRevenueData).map((domain) => domain.revenue),
    },
  ];

  // Graph Options
  const options = {
    chart: { type: "bar", stacked: false, fontFamily: "Poppins-Regular" },
    xaxis: {
      categories:
        viewType === "month"
          ? selectedMonthData.domains.map((domain) => domain.name)
          : Object.keys(yearlyRevenueData),
    },
    yaxis: { title: { text: "Revenue (in Rupees)" } },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "20%", borderRadius: 3 },
    },
    legend: { position: "top" },
    dataLabels: { enabled: false },
    colors: ["#00cdd1"],
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* View Type Selection */}
      <div className=" flex gap-4">
        <FormControl size="small">
          <InputLabel>Select Year</InputLabel>
          <Select
            value={viewType}
            onChange={handleViewTypeChange}
            label={"Select Year"}
            sx={{ width: 200 }}>
            <MenuItem value="month">Monthly</MenuItem>
            <MenuItem value="year">Yearly</MenuItem>
          </Select>
        </FormControl>

        {viewType === "month" && (
          <FormControl size="small">
            <InputLabel>Select Month</InputLabel>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              label="Select Month"
              sx={{ width: 200 }}>
              {mockBusinessRevenueData.map((data) => (
                <MenuItem key={data.month} value={data.month}>
                  {data.month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <WidgetSection layout={1} border padding title={"Unique Leads"}>
        {/* Bar Graph */}
        <BarGraph data={graphData} options={options} height={400} />
      </WidgetSection>

      {/* Accordion Section */}
      <div>
        {viewType === "month"
          ? selectedMonthData.domains.map((domain, index) => (
              <Accordion key={index} className="py-4">
                <AccordionSummary
                  expandIcon={<IoIosArrowDown />}
                  className="border-b-[1px] border-borderGray">
                  <div className="flex justify-between items-center w-full px-4">
                    <span className="text-subtitle font-medium">
                      {domain.name}
                    </span>
                    <span className="text-subtitle font-medium">
                      ₹{domain.revenue.toLocaleString()}
                    </span>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <AgTable
                    data={domain.clients}
                    columns={[
                      { field: "client", headerName: "Client Name", flex: 1 },
                      {
                        field: "representative",
                        headerName: "Representative",
                        flex: 1,
                      },
                      { field: "callDate", headerName: "Call Date", flex: 1 },
                      { field: "status", headerName: "Status", flex: 1 },
                    ]}
                    tableHeight={300}
                  />
                  <span className="block mt-2 font-medium">
                    Total Revenue for {domain.name}: ₹
                    {domain.revenue.toLocaleString()}
                  </span>
                </AccordionDetails>
              </Accordion>
            ))
          : Object.entries(yearlyRevenueData).map(
              ([domainName, data], index) => (
                <Accordion key={index} className="py-4">
                  <AccordionSummary
                    expandIcon={<IoIosArrowDown />}
                    className="border-b-[1px] border-borderGray">
                    <div className="flex justify-between items-center w-full px-4">
                      <span className="text-subtitle font-medium">
                        {domainName}
                      </span>
                      <span className="text-subtitle font-medium">
                        ₹{data.revenue.toLocaleString()}
                      </span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <AgTable
                      data={data.clients}
                      columns={[
                        { field: "client", headerName: "Client Name", flex: 1 },
                        {
                          field: "representative",
                          headerName: "Representative",
                          flex: 1,
                        },
                        { field: "callDate", headerName: "Call Date", flex: 1 },
                        { field: "status", headerName: "Status", flex: 1 },
                      ]}
                      tableHeight={300}
                    />
                  </AccordionDetails>
                </Accordion>
              )
            )}
      </div>
    </div>
  );
};

export default UniqueLeads;
