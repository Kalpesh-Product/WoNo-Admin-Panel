import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const PieChartMui = ({ data, title }) => {
  return (
    <div className="border-default border-borderGray rounded-md">
      <div className="gray-underline p-4">
        <h1 className="text-xl">{title}</h1>
      </div>
      <div className="w-full m-0 flex p-4">
        <PieChart
          series={[
            {
              arcLabel: (item) => `${item.label}`,

              data: data.map((item) => ({
                ...item,
                value: item.value, // The value for the pie slice
                name: item.name, // Optional, for labels or legends
                backgroundColor: item.color, // Use the color from the data
              })),
            },
          ]}
          width={500}
          height={300}
          slotProps={{
            legend: {
              direction: "column",
              position: {
                horizontal: "right",
                vertical: "top",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PieChartMui;
