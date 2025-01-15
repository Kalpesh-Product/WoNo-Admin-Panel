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

  

  

  const laptopColumns = [
    
     
    { field: "RaisedBy", headerName: "Raised By",flex:1 },
    { field: "SelectedDepartment", headerName:"Selected Department",flex:1},
    { field:"TicketTitle",headerName:"Ticket Title",flex:1},
    { field:"Priority",headerName:"Priority",flex:1, cellRenderer: PriorityCellRenderer,},
    // {
    //   headerName: '"PRIORITY',
    //   field: 'priority',
    //   cellRenderer: PriorityCellRenderer, // Use the custom cell renderer
    // },
  
    // { field: "clientname", headerName: "CLIENT NAME" },
    // {
    //   field: "status",
    //   headerName: "status",
    //   cellRenderer: (params) => {
    //     const statusColorMap = {
    //       Unassigned: { backgroundColor: "#FFECC5", color: "#CC8400" }, // Light orange bg, dark orange font
    //       "in-progress": { backgroundColor: "#ADD8E6", color: "#00008B" }, // Light blue bg, dark blue font
    //       Assigned: { backgroundColor: "#90EE90", color: "#006400" }, // Light green bg, dark green font
    //       Open: { backgroundColor: "#E6E6FA", color: "#4B0082" }, // Light purple bg, dark purple font
    //       Closed: { backgroundColor: "#D3D3D3", color: "#696969" }, // Light gray bg, dark gray font
    //     };

    //     const { backgroundColor, color } = statusColorMap[params.value] || {
    //       backgroundColor: "gray",
    //       color: "white",
    //     };
    //     return (
    //       <>
    //         <Chip
    //           label={params.value}
    //           style={{
    //             backgroundColor,
    //             color,
    //           }}
    //         />
    //       </>
    //     );
    //   },
    // },
    // { field: "dueby", headerName: "DUE BY" },
    // { field: "type", headerName: "TYPE" },
    // { field: "solvedby", headerName: "SOLVED BY" },
  ];

  const rows = [
    {
      RaisedBy:"Abrar Shaikh",
      SelectedDepartment:"IT",
      TicketTitle:"Wifi is not working",
      Priority:"High"
    },
    {
      RaisedBy:"Abrar Shaikh",
      SelectedDepartment:"Admin",
      TicketTitle:"Ac is not working",
      Priority:"Medium"
    },
    {
      RaisedBy:"Abrar Shaikh",
      SelectedDepartment:"Admin",
      TicketTitle:"Need more chairs in Baga Room",
      Priority:"Medium"
    },
    {
      RaisedBy:"Abrar Shaikh",
      SelectedDepartment:"Admin",
      TicketTitle:"Need water bottles on the bottle",
      Priority:"High"
    },
    {
      RaisedBy:"Abrar Shaikh",
      SelectedDepartment:"Tech",
      TicketTitle:"Website is taking time to load",
      Priority:"High"
    }
    
  ];
  return (
    <div>
      <div className="w-full rounded-md bg-white p-4 ">
        
        <div className=" w-full">
          <AgTable
            data={rows}
            columns={laptopColumns}
            paginationPageSize={10}
           
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
