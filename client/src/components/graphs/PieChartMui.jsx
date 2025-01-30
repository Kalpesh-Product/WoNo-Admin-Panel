import React from "react";
import ReactApexChart from "react-apexcharts";

const PieChartMui = ({ data, options, customLegend, width }) => {
  // Extract series data for ApexCharts
  const chartData = data.map((item) => parseFloat(item.value)); // Ensure values are numbers

  return (
    <div className="">
      <div className="w-full m-0 flex  gap-4">
        <ReactApexChart
          options={options} // Use options passed directly from parent
          series={chartData} // Data values for the pie slices
          type="pie"
          width={width ? width : 550}
          height={350}
        />

         {/* Custom Legend Passed from Parent */}
         {customLegend && <div className="flex-1 p-4 justify-center items-center">{customLegend}</div>}
      </div>
    </div>
  );
};

export default PieChartMui;
