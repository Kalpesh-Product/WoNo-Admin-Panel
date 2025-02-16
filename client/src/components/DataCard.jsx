import React from "react";

const DataCard = ({data, title, description}) => {
  return (
    <div>
      <div className="bg-white shadow-md p-4 rounded-md text-center">
        <div className="flex w-full justify-between items-center">
            <div className={`text-5xl font-pmedium text-black `}>{data}</div>
            <div className="text-end">
                <div className="font-pmedium text-3xl">{title}</div>
                <div><span className="text-md text-gray-400">{description}</span></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DataCard;
