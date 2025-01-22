import React from "react";
import ReactApexChart from "react-apexcharts";

const PieChartMui = ({ data, title, options, tooltipFormatter }) => {
  // Extract series data for ApexCharts
  const chartData = data.map((item) => parseFloat(item.value)); // Ensure values are numbers

  return (
    <div className="border-default border-borderGray rounded-md">
      <div className="gray-underline p-4">
        <h1 className="text-subtitle">{title}</h1>
      </div>
      <div className="w-full m-0 flex p-4">
        <ReactApexChart
          options={options} // Use options passed directly from parent
          series={chartData} // Data values for the pie slices
          type="pie"
          width={500}
          height={300}
        />
      </div>
    </div>
  );
};

export default PieChartMui;
