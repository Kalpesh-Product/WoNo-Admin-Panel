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
        columnWidth: '45%',
        borderRadius: 8,
        dataLabels: {
          position: 'top',
        },
      },
    },
    colors: ['#00FF00', '#0000FF', '#FF0000'], // Green (Utilised), Blue (Default), Red (Exceeded)
    dataLabels: {
      enabled: true,
      formatter: (value, { seriesIndex, dataPointIndex, w }) => {
        // Disable labels for the "Default Budget" series (index 1)
        if (seriesIndex === 1) return '';
        return `${value}%`;
      },
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

  const utilisedData = [125, 150, 99, 85, 70, 50, 80, 95, 100, 65, 50, 120];

  // Calculate adjusted default and exceeded data
  const defaultData = utilisedData.map((value) => Math.max(100 - Math.min(value, 100), 0));
  const utilisedStack = utilisedData.map((value) => Math.min(value, 100));
  const exceededData = utilisedData.map((value) => (value > 100 ? value - 100 : 0));

  const series = [
    {
      name: 'Utilised Budget',
      data: utilisedStack,
      group: 'budget',
    },
    {
      name: 'Default Budget',
      data: defaultData,
      group: 'budget',
    },
    {
      name: 'Exceeded Budget',
      data: exceededData,
      group: 'budget',
    },
  ];

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default LayerBarGraph;
