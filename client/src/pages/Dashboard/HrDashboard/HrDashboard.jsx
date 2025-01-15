import React from "react";
import WidgetSection from "../../../components/WidgetSection";
import LayerBarGraph from "../../../components/graphs/LayerBarGraph";

const HrDashboard = () => {

  const financialYear = [
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    'January',
    'February',
    'March',
  ];
  
  // Example department task data
  const departmentData = {
    Tech: [10, 20, 40, 25, 30, 20, 35, 40, 45, 50, 55, 60],
    Sales: [15, 25, 20, 30, 35, 25, 40, 45, 50, 55, 60, 65],
    Finance: [20, 30, 25, 35, 40, 30, 45, 50, 55, 60, 65, 70],
  };
  
  // Example completed task data
  const completedData = {
    Tech: [8, 18, 38, 20, 28, 18, 30, 35, 40, 48, 50, 58],
    Sales: [12, 22, 18, 27, 32, 23, 35, 42, 45, 52, 58, 60],
    Finance: [18, 28, 20, 33, 38, 25, 40, 48, 50, 55, 60, 65],
  };
  
  // Calculate the total tasks for each month
  const totalTasks = financialYear.map((_, index) =>
    Object.values(departmentData).reduce((sum, dept) => sum + dept[index], 0)
  );
  
  // Prepare series data for total tasks (stacked)
  const totalSeries = Object.keys(departmentData).map((department) => ({
    name: department,
    group: 'total',
    data: departmentData[department].map((tasks, index) => Math.round((tasks / totalTasks[index]) * 100)),
  }));
  
  // Prepare series data for completed tasks (stacked)
  const completedSeries = Object.keys(completedData).map((department) => ({
    name: department,
    group: 'completed',
    data: completedData[department].map((tasks, index) => Math.round((tasks / totalTasks[index]) * 100)),
  }));
  
  // Combine both series
  const series = [...totalSeries, ...completedSeries];
  
  const options = {
    chart: {
      type: 'bar',
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
      },
    },
    xaxis: {
      categories: financialYear,
    },
    tooltip: {
      y: {
        formatter: (value, { seriesIndex, dataPointIndex, w }) => {
          const total = totalTasks[dataPointIndex];
          return `${value}% (Total: ${total})`;
        },
      },
    },
    yaxis: {
      max: 100,
      labels: {
        formatter: (value) => `${Math.round(value)}%`,
      },
    },
    legend: {
      show: true,
      position: 'top',
    },
  };
  const hrWidgets = [
    {
      layout: 1,
      widgets: [<LayerBarGraph
        title="Department-Wise Task Achievement"
        data={series}
        options={options}
      />],
    },
  ];
  return (
    <>
      {hrWidgets.map((widget, index) => (
        <divj>
          <WidgetSection layout={widget.layout} key={index}>
            {widget.widgets}
          </WidgetSection>
        </divj>
      ))}
    </>
  );
};

export default HrDashboard;
