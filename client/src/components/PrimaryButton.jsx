import React from "react";

const PrimaryButton = ({ title, handleSubmit, type }) => {
  return (
    <div>
      <button
        type={type}
        className=" px-8 py-2 bg-primary text-white rounded-md text-content"
        onClick={handleSubmit}>
        {title}
      </button>
    </div>
  );
};

export default PrimaryButton;
