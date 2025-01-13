import React,{useState} from "react";
import WidgetSection from "../../components/WidgetSection";
import Card from "../../components/Card";
import AgTable from "../../components/AgTable";
import { Button, IconButton, TextField, Box } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const TicketSettings = () => {
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRowExpansion = (id) => {
        setExpandedRow(expandedRow === id ? null : id); // Toggle expanded row
      };
  const laptopColumns = [
    { field: "RaisedBy", headerName: "Raised By", flex: 1 },
    { field: "FromDepartment", headerName: "From Department", flex: 1 },
    { field: "TicketTitle", headerName: "Ticket Title", flex: 1 },
    { field: "Status", headerName: "Status", flex: 1 },

    {
        field: "Action",
        headerName: "Action",
        flex: 1,
        cellRenderer: (params) => (
          <IconButton
            onClick={() => toggleRowExpansion(params.data?.id)}
          >
            {expandedRow === params.data?.id ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        ),
      },
  ];
 

  const rows = [
    {
      RaisedBy:"Abrar Shaikh",
      FromDepartment:"IT",
      TicketTitle:"Laptop Screen Malfunctioning",
      Status:"Pending"
    },
    {
        RaisedBy:"Abrar Shaikh",
        FromDepartment:"IT",
        TicketTitle:"Laptop Screen Malfunctioning",
        Status:"Pending"
    },
    {
        RaisedBy:"Abrar Shaikh",
        FromDepartment:"IT",
        TicketTitle:"Laptop is not working",
        Status:"Pending"
    },
    {
        RaisedBy:"Abrar Shaikh",
        FromDepartment:"IT",
        TicketTitle:"Wifi is slow",
        Status:"Pending"
    },
    {
        RaisedBy:"Abrar Shaikh",
        FromDepartment:"IT",
        TicketTitle:"Laptop Screen Malfunctioning",
        Status:"Pending"
    },
  ];
 
  return (
    <div>
      <WidgetSection layout={4}>
        <Card
          title={"New Tickets"}
          bgcolor={"white"}
          data={"25"}
          titleColor={"#1E3D73"}
          fontColor={"#1E3D73"}
          height={"10rem"}
          fontFamily={"Poppins-Bold"}
        />
        <Card
          title={"Rejected Tickets"}
          data={"10"}
          bgcolor={"White"}
          titleColor={"red"}
          fontColor={"red"}
          height={"10rem"}
          fontFamily={"Poppins-Bold"}
        />
        <Card
          title={"Pending Tickets"}
          data={"10"}
          bgcolor={"white"}
          titleColor={"yellow"}
          fontColor={"yellow"}
          height={"10rem"}
          fontFamily={"Poppins-Bold"}
        />
        <Card
          title={"Approved Tickets"}
          bgcolor={"white"}
          data={"05"}
          titleColor={"green"}
          fontColor={"green"}
          height={"10rem"}
          fontFamily={"Poppins-Bold"}
        />
      </WidgetSection>
      <div>
        <div className="rounded-md bg-white p-4 border-2 m-4">
          
          <div className=" w-full">
            <AgTable
              data={rows}
              columns={laptopColumns}
              paginationPageSize={10}
              rowHeight={expandedRow ? 120 : 60} // Adjust row height when expanded
              components={{
                Row: (props) => {
                  const isExpanded = expandedRow === props.data.id;
      
                  return (
                    <>
                      <div {...props}>
                        {/* Render default row */}
                        {props.children}
                      </div>
                      {isExpanded && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 2,
                            borderTop: "1px solid #ddd",
                          }}
                        >
                          {/* Expanded row content */}
                          <TextField
                            label="Input 1"
                            variant="outlined"
                            size="small"
                            sx={{ marginRight: 2 }}
                          />
                          <TextField
                            label="Input 2"
                            variant="outlined"
                            size="small"
                            sx={{ marginRight: 2 }}
                          />
                          <TextField
                            label="Input 3"
                            variant="outlined"
                            size="small"
                            sx={{ marginRight: 2 }}
                          />
                          <Button variant="contained" color="primary">
                            Approve
                          </Button>
                          <Button variant="contained" color="secondary" sx={{ marginLeft: 2 }}>
                            Reject
                          </Button>
                        </Box>
                      )}
                    </>
                  );
                },
            }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSettings;
