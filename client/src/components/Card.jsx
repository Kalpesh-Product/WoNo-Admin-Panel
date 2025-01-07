import React from "react";

const Card = ({ title, icon }) => {
  return (
    <div>
      <div className="bg-white shadow-md p-4 rounded-md text-center">
        <div className="flex items-center justify-center text-4xl mb-4">{icon}</div>
        <span className="text-center">{title}</span>
      </div>
    </div>
  );
};

export default Card;
