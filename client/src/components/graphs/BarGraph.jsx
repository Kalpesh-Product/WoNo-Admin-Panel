import React from "react";
import Chart from "react-apexcharts";

const BarGraph = ({ data, title, options }) => {

  return (
    <div className="bg-white  rounded-md">
      {title ? (
        <div className="border-b-2 p-4 border-gray-200">
          <span className="text-lg">{title}</span>
        </div>
      ) : (
        ""
      )}
      <Chart options={options} series={data} type="bar" height={350} />
    </div>
  );
};

export default BarGraph;
