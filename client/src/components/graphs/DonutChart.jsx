import React from "react";
import ReactApexChart from "react-apexcharts";

const DonutChart = ({centerLabel}) => {
  // Example data
  const chartData = {
    series: [40, 30, 30], // High, Medium, Low percentages
    labels: ["High", "Medium", "Low"],
    colors: ["#ff4d4d", "#ffc107", "#28a745"], // Red, Yellow, Green
  };

  const chartOptions = {
    chart: {
      type: "donut",
    },
    colors: chartData.colors,
    labels: chartData.labels,
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: `Total ${centerLabel}`,
              fontSize: "16px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
  };

  return (
    <div className="border-borderGray border-default p-4 rounded-md">
      <span className="text-subtitle mb-4">Priority Overview</span>
      <ReactApexChart
        options={chartOptions}
        series={chartData.series}
        type="donut"
        height={350}
      />
    </div>
  );
};

export default DonutChart;
