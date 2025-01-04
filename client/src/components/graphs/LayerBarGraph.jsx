import React from 'react';
import Chart from 'react-apexcharts';

const LayerBarGraph = () => {
  const options = {
    chart: {
      type: 'bar',
      stacked: true, // Stacked bars to show utilised and exceeded in the same bar
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
      },
    },
    colors: [ '#00FF00','#0000FF', '#FF0000'], // Blue, Green, Red #00FF00
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    },
    yaxis: {
      max: 100, // Ensures the default budget bar is always 100%
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

  const utilisedData = [75, 60, 90, 85, 70, 50, 80, 95, 110, 65, 78, 120];

  const series = [
    {
        name: 'Utilised Budget',
        data: utilisedData.map(value => Math.min(value, 100)),
      },
    {
      name: 'Default Budget',
      data: Array(12).fill(100),
    },

    {
      name: 'Exceeded Budget',
      data: utilisedData.map(value => (value > 100 ? value - 100 : 0)),
    },
  ];

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default LayerBarGraph;
