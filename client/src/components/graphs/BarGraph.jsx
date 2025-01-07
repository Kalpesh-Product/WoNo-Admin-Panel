import React from "react";
import Chart from "react-apexcharts";

const BarGraph = ({ data, title }) => {
  // Array of random data for the bar graph
  const financialYears = [
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

  const options = {
    chart: {
      type: "bar",
      offsetY : 8,
      toolbar: {
        show: true, // Hide the toolbar for simplicity
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
        borderRadius: 8,
        dataLabels: {
          enabled: true, // Enable data labels
          position: "top", // Place data labels at the top of bars
          offsetY: -20,
          style: {
            colors: ["#000"], // Set the color of the labels (black in this case)
            fontSize: "5px",
            fontWeight: "bold",
          },
        },
      },
    },
    xaxis: {
      categories: financialYears,
    },
    yaxis: {
      min: 0,
      max: 1500,
    },
    colors: ["#1E90FF"], // Set bar color
    tooltip: {
      y: {
        formatter: (value) => `${value}`, // Format tooltip
      },
    },
  };

  const series = [
    {
      name: "Unique Companies",
      data: data, // Use the random data array here
    },
  ];

  return (
    <div className="bg-white">
      <div className="border-b-2 p-4 border-gray-200">
        <span className="text-lg">{title}</span>
      </div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default BarGraph;
