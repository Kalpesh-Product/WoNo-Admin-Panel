import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Select, MenuItem, FormControl } from "@mui/material";

const BarGraph = ({ data, title, options, height }) => {
  const [selectedYear, setSelectedYear] = useState("2024-2025");

  // Function to update year selection
  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Dynamically update only the x-axis title
  const updatedOptions = {
    ...options,
    xaxis: {
      ...options?.xaxis,
      title: { text: selectedYear },
    },
  };

  return (
    <div className="bg-white rounded-md">
      {/* Header section with title and financial year dropdown */}
      <div className="border-b-2 p-4 pt-0 border-gray-200 flex justify-end">
        {title && <span className="text-lg">{title}</span>}
        <FormControl size="small">
          <Select value={selectedYear} onChange={handleYearChange}>
            <MenuItem value="2023-2024">2023-2024</MenuItem>
            <MenuItem value="2024-2025">2024-2025</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Chart Component */}
      <Chart
        options={updatedOptions}
        series={data}
        type="bar"
        height={height || 350}
      />
    </div>
  );
};

export default BarGraph;
