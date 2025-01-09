import React from 'react'
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";


const AgTable = React.memo(
    ({
      data,
      columns,
      paginationPageSize,
      highlightFirstRow,
      highlightEditedRow,
    }) => {
      const defaultColDef = {
        resizable: true,
        sortable: true,
        // filter: true,
        autoHeight: true,
        // filter: "agTextColumnFilter",
        // floatingFilter: true,
        cellStyle: {
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          padding: "px", // Add padding for spacing
          // width:'100%'
        },
      };
      // const rowStyle = {width : '100%', overFlowX:'auto'}
  
      // Define the row style conditionally
      const getRowStyle = (params) => {
        if (highlightFirstRow && params.node.rowIndex === 2) {
          // if (highlightFirstRow) {
          // return { backgroundColor: "grey" };
          return { backgroundColor: "#f5f5f5", color: "#b0b0b0" };
        } else if (highlightEditedRow && params.node.rowIndex === 1) {
          // if (highlightEditedRow) {
          // return { backgroundColor: "grey" };
          return { backgroundColor: "#beffa9", color: "black" };
        }
        return null;
      };
  
      return (
        <div
          className="ag-theme-quartz border-none w-full"
          style={{ width: "100%",height:500,overflowY:'auto', fontFamily: "Popins-Regular" }}>
          <AgGridReact
            rowData={data}
            columnDefs={columns}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={paginationPageSize}
            domLayout="normal"
            rowHeight={50} // Increased row height for better spacing
            getRowStyle={getRowStyle}
            // rowStyle={rowStyle}
          />
        </div>
        
      );
    }
  );
  

export default AgTable