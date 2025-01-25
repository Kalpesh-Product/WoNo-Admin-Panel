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
    <>
    <div class="flex justify-between items-center mb-6">
    <div class="w-1/4">
      <input
        type="text"
        placeholder="Search Job Application"
        class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div class="flex space-x-4">
      
      <button class="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-5 h-5 mr-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
        Sort
      </button>
     
      <button class="flex items-center px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-5 h-5 mr-2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
        Filter
      </button>
    </div>
  </div>

  <div className="border-default rounded-md">
  <h2 class="text-title font-pmedium text-primary p-5">Bulk Upload Data</h2>

    <div className="grid lg:grid-cols-3 md:grid-col-3 sm:grid-col-1">
      {uploadItems.map((index, item) => {
        return (
          <>
            <div className="space-y-2 space-x-2 border-default p-4 m-4 rounded-md" key={index}>
              <div className="mb-2">{index}</div>
              <div className="flex  space-x-2 ">
                {/* Placeholder Input Box */}
                <div className="flex items-center w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md">
                  <span className="text-white bg-gray-600 rounded-md p-2">Choose file</span>
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
    </div>
    </>
  );
};

export default BulkUpload;
