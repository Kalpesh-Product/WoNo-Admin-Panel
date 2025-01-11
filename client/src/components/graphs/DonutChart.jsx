import React from "react";
import ReactApexChart from "react-apexcharts";

const DonutChart = ({ centerLabel, labels, colors, series, title }) => {
  // Example data
  const chartData = {
    series: series, // High, Medium, Low percentages
    labels: labels,
    colors: colors, // Red, Yellow, Green
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
    <div className="border-borderGray border-default py-4 rounded-md">
      <div className="border-b-default border-borderGray pb-4 px-4">
        <span className="text-subtitle">
          {title}
        </span>
      </div>
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
