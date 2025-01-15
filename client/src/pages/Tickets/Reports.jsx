import React,{useState} from "react";
import AgTable from "../../components/AgTable";
import { Chip } from "@mui/material";

const Reports = () => {

  const PriorityCellRenderer = (params) => {
    const { value } = params;
  
    // Determine the color based on priority
    let color = '';
    switch (value) {
      case 'High':
        color = 'red';
        break;
      case 'Medium':
        color = 'yellow';
        break;
      case 'Low':
        color = 'green';
        break;
      default:
        color = 'black'; // Fallback color
    }
  
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: color,
            display: 'inline-block',
            marginRight: '8px',
          }}
        ></span>
        {value}
      </div>
    );
  };

  const [selectedRows, setSelectedRows] = useState([]);


  const onSelectionChanged = (event) => {
    const selectedNodes = event.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const laptopColumns = [
    {
      headerCheckboxSelection: true, // Adds a checkbox in the header for select-all
      checkboxSelection: true, // Adds a checkbox before each row
      width: 50,
    },
    
     
    { field: "ticketid", headerName: "TICKET ID" },
    {
      headerName: '"PRIORITY',
      field: 'priority',
      cellRenderer: PriorityCellRenderer, // Use the custom cell renderer
    },
  
    { field: "clientname", headerName: "CLIENT NAME" },
    {
      field: "status",
      headerName: "status",
      cellRenderer: (params) => {
        const statusColorMap = {
          Unassigned: { backgroundColor: "#FFECC5", color: "#CC8400" }, // Light orange bg, dark orange font
          "in-progress": { backgroundColor: "#ADD8E6", color: "#00008B" }, // Light blue bg, dark blue font
          Assigned: { backgroundColor: "#90EE90", color: "#006400" }, // Light green bg, dark green font
          Open: { backgroundColor: "#E6E6FA", color: "#4B0082" }, // Light purple bg, dark purple font
          Closed: { backgroundColor: "#D3D3D3", color: "#696969" }, // Light gray bg, dark gray font
        };

        const { backgroundColor, color } = statusColorMap[params.value] || {
          backgroundColor: "gray",
          color: "white",
        };
        return (
          <>
            <Chip
              label={params.value}
              style={{
                backgroundColor,
                color,
              }}
            />
          </>
        );
      },
    },
    { field: "dueby", headerName: "DUE BY" },
    { field: "type", headerName: "TYPE" },
    { field: "solvedby", headerName: "SOLVED BY" },
  ];

  const rows = [
    {
      ticketid: "TID094678",
      priority: "Low",
      clientname: "xyz",
      status: "Open",
      dueby: "22 Dec 2024",
      type: "Technical",
      solvedby: "Shekar Khan",
    },
    {
      ticketid: "TID456789",
      priority: "Medium",
      clientname: "xyz",
      status: "Closed",
      dueby: "22 Dec 2024",
      type: "Technical",
      solvedby: "Shekar Khan",
    },
    {
      ticketid: "TID234896",
      priority: "Low",
      clientname: "xyz",
      status: "Paused",
      dueby: "22 Dec 2024",
      type: "Technical",
      solvedby: "Shekar Khan",
    },
    {
      ticketid: "TID234839",
      priority: "Medium",
      clientname: "xyz",
      status: "Assigned",
      dueby: "22 Dec 2024",
      type: "Technical",
      solvedby: "Shekar Khan",
    },
    {
      ticketid: "TID234567",
      priority: "High",
      clientname: "xyz",
      status: "Unassigned",
      dueby: "22 Dec 2024",
      type: "Technical",
      solvedby: "Shekar Khan",
    },
    {
      ticketid: "TID956234",
      priority: "High",
      clientname: "xyz",
      status: "Unassigned",
      dueby: "22 Dec 2024",
      type: "Technical",
      solvedby: "Shekar Khan",
    },
  ];
  return (
    <div>
      <div className="w-full rounded-md bg-white p-4 ">
        <div className="flex flex-row justify-between mb-4">
          <div>Tickets Reports</div>
        </div>
        <div className=" w-full">
          <AgTable
            data={rows}
            columns={laptopColumns}
            paginationPageSize={10}
            rowSelection="multiple"
            onSelectionChanged={onSelectionChanged} // Enables multiple row selection
            domLayout="autoHeight"
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
