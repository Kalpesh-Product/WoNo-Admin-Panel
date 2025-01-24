import React from "react";

const BulkUpload = () => {
  const uploadItems = [
    "Upload Employee",
    "Upload Budgets",
    "Upload Finance",
    "Upload Templates",
    "Upload Sops",
    "Upload Policies",
  ];
  return (
    <div className="grid lg:grid-cols-3 md:grid-col-3 sm:grid-col-1">
      {uploadItems.map((index, item) => {
        return (
          <>
            <div className=" flex flex-col items-start space-y-2 " key={index}>
              <div className="mb-2">{index}</div>
              <div className="flex items-center space-x-2">
                {/* Placeholder Input Box */}
                <div className="flex items-center w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">
                  <span className="text-gray-500">Choose file</span>
                </div>

                {/* Filter Button */}
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 bg-teal-500 text-white rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 3h4M8 7h8m-6 4h4m-2 4h4M5 17h14m-6 4v-4m0-4v-4m0-4V3"
                    />
                  </svg>
                </button>

                {/* Download/Export Button */}
                <button
                  type="button"
                  className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default BulkUpload;
