import React from 'react';
import Chart from 'react-apexcharts';

const LayerBarGraph = ({ title, data, options }) => {
  return (
    <div className='bg-white rounded-md border-borderGray border-default'>
      <div className='border-b-2 p-4 border-gray-200'>
        <span className='text-lg'>{title}</span>
      </div>
    <div className=''>
      <Chart options={options} series={data} type="bar" height={350} />
    </div>
    </div>
  );
};

export default LayerBarGraph;
