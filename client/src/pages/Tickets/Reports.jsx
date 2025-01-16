import React, { useState } from "react";
import AgTable from "../../components/AgTable";
import { Button, TextField, MenuItem } from "@mui/material";
import MuiAside from "../../components/MuiAside";
import PrimaryButton from "../../components/PrimaryButton";
import { IoFilterCircleOutline } from "react-icons/io5";

const Reports = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    RaisedBy: "",
    SelectedDepartment: "All",
    TicketTitle: "",
    Priority: "All",
  });
  const [filteredRows, setFilteredRows] = useState([]);

  const departments = ["All", "IT", "Admin", "Tech"];
  const priorities = ["All", "High", "Medium", "Low"];

  const rows = [
    {
      RaisedBy: "Abrar Shaikh",
      SelectedDepartment: "IT",
      TicketTitle: "Wifi is not working",
      Priority: "High",
    },
    {
      RaisedBy: "Abrar Shaikh",
      SelectedDepartment: "Admin",
      TicketTitle: "Ac is not working",
      Priority: "Medium",
    },
    {
      RaisedBy: "Abrar Shaikh",
      SelectedDepartment: "Admin",
      TicketTitle: "Need more chairs in Baga Room",
      Priority: "Medium",
    },
    {
      RaisedBy: "Abrar Shaikh",
      SelectedDepartment: "Admin",
      TicketTitle: "Need water bottles on the bottle",
      Priority: "High",
    },
    {
      RaisedBy: "Abrar Shaikh",
      SelectedDepartment: "Tech",
      TicketTitle: "Website is taking time to load",
      Priority: "High",
    },
  ];

  const PriorityCellRenderer = (params) => {
    const { value } = params;

    let color = "";
    switch (value) {
      case "High":
        color = "red";
        break;
      case "Medium":
        color = "yellow";
        break;
      case "Low":
        color = "green";
        break;
      default:
        color = "black";
    }

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: color,
            display: "inline-block",
            marginRight: "8px",
          }}
        ></span>
        {value}
      </div>
    );
  };

  const laptopColumns = [
    { field: "RaisedBy", headerName: "Raised By", flex: 1 },
    { field: "SelectedDepartment", headerName: "Selected Department", flex: 1 },
    { field: "TicketTitle", headerName: "Ticket Title", flex: 1 },
    {
      field: "Priority",
      headerName: "Priority",
      flex: 1,
      cellRenderer: PriorityCellRenderer,
    },
  ];

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const filtered = rows.filter((row) => {
      return (
        (!filters.RaisedBy ||
          row.RaisedBy.toLowerCase().includes(
            filters.RaisedBy.toLowerCase()
          )) &&
        (filters.SelectedDepartment === "All" ||
          row.SelectedDepartment === filters.SelectedDepartment) &&
        (!filters.TicketTitle ||
          row.TicketTitle.toLowerCase().includes(
            filters.TicketTitle.toLowerCase()
          )) &&
        (filters.Priority === "All" || row.Priority === filters.Priority)
      );
    });
    setFilteredRows(filtered);
    setFilterOpen(false);
  };

  return (
    <div>
      <div className="w-full rounded-md bg-white p-4 ">
        <div className="flex justify-end items-center pb-4">
          <Button sx={{ fontSize: "2rem" }} onClick={() => setFilterOpen(true)}>
            <span className="text-primary font-pregular">
              <IoFilterCircleOutline />
            </span>
          </Button>
        </div>
        <div className="w-full">
          {filteredRows.length > 0 ? (
            <AgTable
              data={filteredRows.length > 0 ? filteredRows : rows}
              columns={laptopColumns}
              paginationPageSize={10}
            />
          ) : (
            <div className="text-center text-gray-500">No data available</div>
          )}
        </div>
      </div>

      {/* Sidebar for Filtering */}
      <MuiAside title={"Filter Options"} open={filterOpen} onClose={() => setFilterOpen(false)}>
        <TextField
          label="Raised By"
          size="small"
          variant="outlined"
          fullWidth
          margin="normal"
          value={filters.RaisedBy}
          onChange={(e) => handleFilterChange("RaisedBy", e.target.value)}
          slotProps={{
            input: { style: { fontSize: "0.875rem" } },
            inputLabel: { style: { fontSize: "0.875rem" } },
          }}
        />
        <TextField
          label="Selected Department"
          size="small"
          variant="outlined"
          fullWidth
          margin="normal"
          select
          value={filters.SelectedDepartment}
          onChange={(e) =>
            handleFilterChange("SelectedDepartment", e.target.value)
          }
          slotProps={{
            input: { style: { fontSize: "0.875rem" } },
            inputLabel: { style: { fontSize: "0.875rem" } },
          }}
        >
          {departments.map((department) => (
            <MenuItem
              key={department}
              value={department}
            >
              {department}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Ticket Title"
          size="small"
          variant="outlined"
          fullWidth
          margin="normal"
          value={filters.TicketTitle}
          onChange={(e) => handleFilterChange("TicketTitle", e.target.value)}
          slotProps={{
            input: { style: { fontSize: "0.875rem" } },
            inputLabel: { style: { fontSize: "0.875rem" } },
          }}
        />
        <TextField
          label="Priority"
          size="small"
          variant="outlined"
          fullWidth
          margin="normal"
          select
          value={filters.Priority}
          onChange={(e) => handleFilterChange("Priority", e.target.value)}
          slotProps={{
            input: { style: { fontSize: "0.875rem" } },
            inputLabel: { style: { fontSize: "0.875rem" } },
          }}
        >
          {priorities.map((priority) => (
            <MenuItem
              key={priority}
              value={priority}
              sx={{
                ".MuiInputBase-input": { fontSize: "0.875rem" },
              }}
            >
              {priority}
            </MenuItem>
          ))}
        </TextField>

        <div className="flex justify-center w-full pt-2">
          <PrimaryButton
            title={"Apply Filter"}
            externalStyles={"w-full"}
            handleSubmit={applyFilters}
          />
        </div>
      </MuiAside>
    </div>
  );
};

export default Reports;
