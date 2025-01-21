import React from "react";
import Template from "../../../../utils/Template.png";
import Template2 from "../../../../utils/Template1.png";
import Template1 from "../../../../utils/Template2.png";
import Template3 from "../../../../utils/Template3.png";
import Template4 from "../../../../utils/Template4.png";
import PrimaryButton from "../../../../components/PrimaryButton";

const Templates = () => {
  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <span className="font-pmedium text-primary text-title ">Templates</span>
        <PrimaryButton title={"Add Template"} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <img
            src={Template}
            alt="Template Image"
            className="w-full h-50 object-cover"
          ></img>
          <div className="p-4">
            <h2 className="text-lg font-semibold font-pregular">Leave Agreement</h2>
            <p className="text-sm text-gray-500 font-pregular">Jan 10, 2025</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <img
            src={Template2}
            alt="Template Image"
            className="w-full h-50 object-cover"
          ></img>
          <div className="p-4">
            <h2 className="text-lg font-semibold font-pregular">
              Allowance Agreement
            </h2>
            <p className="text-sm text-gray-500 font-pregular">
              Opened Jan 7, 2025
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <img
            src={Template1}
            alt="Template Image"
            className="w-full h-50 object-cover"
          ></img>
          <div className="p-4">
            <h2 className="text-lg font-semibold font-pregular">
              Timings Agreement
            </h2>
            <p className="text-sm text-gray-500 font-pregular">
              Opened Jan 7, 2025
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <img
            src={Template3}
            alt="Template Image"
            className="w-full h-40 object-cover"
          ></img>
          <div className="p-4">
            <h2 className="text-lg font-semibold font-pregular">SOP Agreement</h2>
            <p className="text-sm text-gray-500 font-pregular">
              Opened Jan 6, 2025
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <img
            src={Template4}
            alt="Template Image"
            className="w-full h-40 object-cover"
          ></img>
          <div className="p-4">
            <h2 className="text-lg font-semibold font-pregular">
              Internship Report
            </h2>
            <p className="text-sm text-gray-500 font-pregular">Dec 24, 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
