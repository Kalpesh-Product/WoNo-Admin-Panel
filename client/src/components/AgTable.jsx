import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { TextField, Button, InputAdornment } from "@mui/material";
import MuiAside from "./MuiAside";
import { IoIosSearch } from "react-icons/io";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const AgTable = React.memo(
  ({
    data,
    columns,
    paginationPageSize,
    highlightFirstRow,
    highlightEditedRow,
    rowSelection,
    search,
    searchColumn,
    tableTitle,
    handleClick,
    buttonTitle,
    tableHeight
  }) => {
    const [filteredData, setFilteredData] = useState(data);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({}); // Stores filter values for each column
    const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);

    const defaultColDef = {
      resizable: true,
      sortable: true,
      autoHeight: true,
      cellStyle: {
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        padding: "px",
      },
    };

    // Map headerName to field for filtering
    const getFieldFromHeaderName = (headerName) => {
      const column = columns.find((col) => col.headerName === headerName);
      return column ? column.field : null;
    };

    // Handle search input changes
    const handleSearch = (event) => {
      const query = event.target.value.toLowerCase();
      setSearchQuery(query);

      const fieldName = getFieldFromHeaderName(searchColumn);
      if (query && fieldName) {
        const filtered = data.filter((row) =>
          row[fieldName]?.toString().toLowerCase().includes(query)
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(data);
      }
    };

    // Handle column filter value changes
    const handleFilterChange = (field, value) => {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    // Apply column filters
    const applyFilters = () => {
      const filtered = data.filter((row) => {
        return Object.keys(filters).every((field) => {
          const filterValue = filters[field]?.toLowerCase();
          return (
            !filterValue ||
            row[field]?.toString().toLowerCase().includes(filterValue)
          );
        });
      });
      setFilteredData(filtered);
      setFilterDrawerOpen(false); // Close the drawer after applying filters
    };

    return (
      <>
        <div className="flex justify-between items-center py-2">
          {/* Search Field */}
          {search && (
            <div>
              <TextField
                label={`Search by ${searchColumn}`}
                variant="outlined"
                size="small"
                sx={{maxWidth:'25rem'}}
                value={searchQuery}
                onChange={handleSearch}
                placeholder={`${searchColumn}`}
                slotProps={{
                  input: {
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <IoIosSearch size={20} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
          )}
          {/* Filter Button */}
          <div className="flex items-center">
            <PrimaryButton
              title={<MdFilterAlt />}
              handleSubmit={() => setFilterDrawerOpen(true)}
            >
              Filter
            </PrimaryButton>
            <SecondaryButton
              title={<MdFilterAltOff />}
              handleSubmit={() => {
                setFilters({}); // Clear all filters
                setSearchQuery(""); // Clear search query
                setFilteredData(data); // Reset table data
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <span className="font-pmedium text-title text-primary">{tableTitle}</span>
          {buttonTitle ? (
            <PrimaryButton title={buttonTitle} handleSubmit={handleClick} />
          ) : (
            ""
          )}
        </div>

        {/* Filter Drawer */}
        <MuiAside
          open={isFilterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          title="Advanced Filter"
        >
          {columns.map((column) => (
            <TextField
              key={column.field}
              label={column.headerName}
              variant="outlined"
              size="small"
              fullWidth
              margin="normal"
              onChange={(e) => handleFilterChange(column.field, e.target.value)}
            />
          ))}
          <div className="flex items-center justify-center py-4">
            <PrimaryButton
              title={"Apply Filters"}
              handleSubmit={applyFilters}
            />
          </div>
        </MuiAside>

        <div
          className="ag-theme-quartz border-none w-full"
          style={{
            width: "100%",
            height: tableHeight ? tableHeight : 500,
            overflowY: "auto",
            fontFamily: "Poppins-Regular",
            borderWidth: 0,
          }}
        >
          <AgGridReact
            style={{ width: "100%", height: "100%" }}
            rowData={filteredData} // Use filtered data here
            columnDefs={columns}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={paginationPageSize}
            domLayout="normal"
            rowHeight={50}
            getRowStyle={(params) =>
              highlightFirstRow && params.node.rowIndex === 0
                ? { backgroundColor: "#f5f5f5", color: "#b0b0b0" }
                : highlightEditedRow && params.node.rowIndex === 1
                ? { backgroundColor: "#beffa9", color: "black" }
                : null
            }
            rowSelection={rowSelection}
          />
        </div>
      </>
    );
  }
);

export default AgTable;
