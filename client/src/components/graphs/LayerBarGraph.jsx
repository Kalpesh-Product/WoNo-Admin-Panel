import React from 'react';
import Chart from 'react-apexcharts';

const LayerBarGraph = () => {
  const options = {
    chart: {
      type: 'bar',
      stacked: true, // Enable stacking
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '70%',
        borderRadius: 5,
        dataLabels: {
          position: 'top',
        },
      },
    },
    colors: ['#0000FF','#00FF00', '#FF0000'], // Green, Red, Blue
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    },
    yaxis: {
      max: 150, // Adjusted to accommodate exceeded budget
      labels: {
        formatter: (value) => `${value}%`,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}%`,
      },
    },
    legend: {
      show: true,
      position: 'top',
    },
  };

  const utilisedData = [125, 150, 90, 85, 70, 50, 80, 95, 100, 65, 50, 120];

  const series = [
    {
        name: 'Default Budget',
        data: Array(12).fill(100),
        group: 'default', // Assign a unique stack for "Default Budget"
      },
    {
      name: 'Utilised Budget',
      data: utilisedData.map((value) => Math.min(value, 100)),
    group : 'budget'
    },
    {
      name: 'Exceeded Budget',
      data: utilisedData.map((value) => (value > 100 ? value - 100 : 0)),
      group: 'budget', // Stack "Utilised" and "Exceeded" together
    },

  ];

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default LayerBarGraph;
