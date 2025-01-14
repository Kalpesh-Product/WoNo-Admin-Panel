import React from "react";
import Chart from "react-apexcharts";

const AreaGraph = () => {
  // Example data
  const chartData = {
    series: [
      {
        name: "Total Tickets",
        data: [150, 120, 100, 50, 100, 200, 80, 130, 140, 90, 110, 170],
        color: "#007bff", // Blue
      },
      {
        name: "Closed Tickets",
        data: [120, 100, 80, 45, 60, 150, 75, 110, 120, 70, 90, 150],
        color: "#28a745", // Green
      },
      {
        name: "Open Tickets",
        data: [30, 20, 20, 5, 40, 50, 5, 20, 20, 20, 20, 20],
        color: "#ff4d4d", // Red
      },
    ],
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ], // Months
  };

  const chartOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: chartData.series.map((item) => item.color),
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: chartData.categories,
    },
    yaxis: {
      min: 0,
      max: 250,
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  return (
    <div className="border-default border-borderGray rounded-md p-4">
      <h2 className="text-title font-pregular mb-4">Tickets Overview</h2>
      <Chart
        options={chartOptions}
        series={chartData.series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default AreaGraph;
