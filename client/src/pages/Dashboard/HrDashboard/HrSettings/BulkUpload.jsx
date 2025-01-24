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
            <div className="w-40 bg-blue gap-5 mb-5 " key={index}>
              <div className="mb-2">{index}</div>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  className="block w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
                      d="M3 10h11M9 21V3m4 4l4 4m0-4-4 4"
                    />
                  </svg>
                </button>
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
                      d="M4 16.5l4 4m0-4-4 4M14 3h6m-6 18h6m0-18v18"
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
