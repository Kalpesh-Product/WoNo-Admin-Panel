import React from "react";
import Chart from "react-apexcharts";

const BarGraph = ({ data, title, categories, minValue, maxValue, colors }) => {

  console.log('colors are : ', colors)

  const series = [
    {
      data: data, // Pass data as is
    },
  ];
  const options = {
    chart: {
      type: "bar",
      offsetY: 8,
      toolbar: {
        show: true, // Hide the toolbar for simplicity
      },
    },

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
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
       categories: data.map((item) => item.x),
    },
    yaxis: {
      min: minValue ? minValue : 0,
      max: maxValue,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}`, // Format tooltip
      },
    },
  };



  return (
    <div className="bg-white border-default border-borderGray rounded-md">
      <div className="border-b-2 p-4 border-gray-200">
        <span className="text-lg">{title}</span>
      </div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default BarGraph;
