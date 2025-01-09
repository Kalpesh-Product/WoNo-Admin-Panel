import React,{ useEffect, useState } from "react";
import AgTable from "../../components/AgTable";
import { DataGrid } from "@mui/x-data-grid";

const MyAssets = () => {
    const laptopColumns = [
        { field: "id", headerName: "ID", flex: 1 },
        { field: "department", headerName: "Department", flex: 1 },
        { field: "assetNumber", headerName: "Asset Number", flex: 1 },
        { field: "category", headerName: "Category", flex: 1 },
        // { field: "assetName", headerName: "Asset Name", width: 150 },
        { field: "brandName", headerName: "Brand", flex: 1 },
        { field: "price", headerName: "Price", flex: 1 },
        { field: "quantity", headerName: "Quantity", flex: 1 },
        // { field: "totalPrice", headerName: "Total Price", flex: 1 },
        // { field: "vendorName", headerName: "Vendor", flex: 200 },
        { field: "purchaseDate", headerName: "Purchase Date", flex: 1 },
        { field: "warranty", headerName: "Warranty (Months)", flex: 1 },
        // { field: "location", headerName: "Location", flex: 150 },
        {
          field: "actions",
          filter: false,
          headerName: "Actions",
          flex: 1,
          cellRenderer: (params) =>
            params.data.status !== "Revoked" ? (
              <div className="p-2 flex gap-2">
                <button
                  style={{
                    backgroundColor: "#0db4ea",
                    color: "white",
                    border: "none",
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    height: "100%",
                  }}
                  >
                  Details
                </button>
                {/* <button
                  style={{
                    backgroundColor: "#0db4ea",
                    color: "white",
                    border: "none",
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    height: "100%",
                  }}
                  onClick={() => handleAssignAsset(params.data)}
                >
                  Assign
                </button> */}
              </div>
            ) : (
              <span style={{ color: "gray", fontStyle: "italic" }}>Revoked</span>
            ),
        },
      ];
  return (
    <div className="w-[72vw] md:w-full transition-all duration-200 ease-in-out bg-white p-0">
      <div className="motion-preset-slide-up-md">
        <AgTable
          
          columns={laptopColumns}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
};

export default MyAssets;
