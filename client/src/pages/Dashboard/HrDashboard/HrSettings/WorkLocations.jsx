import React, {useState} from "react";
import AgTable from "../../../../components/AgTable";
import { Chip } from "@mui/material";
import MuiModal from "../../../../components/MuiModal";

const WorkLocations = () => {
  const departmentsColumn = [
    { field: "srno", headerName: "SR NO" },
    {
      field: "worklocationname",
      headerName: "Work Location Name",
      cellRenderer: (params) => {
        return (
          <div>
            <span className="text-primary cursor-pointer hover:underline">
              {params.value}
            </span>
          </div>
        );
      },
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params) => {
        const statusColorMap = {
          Inactive: { backgroundColor: "#FFECC5", color: "#CC8400" }, // Light orange bg, dark orange font
          Active: { backgroundColor: "#90EE90", color: "#006400" }, // Light green bg, dark green font
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
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => (
        <>
          <div className="p-2 mb-2 flex gap-2">
            <span className="text-content text-primary hover:underline cursor-pointer">
              Make Inactive
            </span>
          </div>
        </>
      ),
    },
  ];

  const rows = [
    {
      srno: "1",
      id: 1,
      worklocationname: "ST 701A",
      status: "Active",
    },
    {
      srno: "2",
      id: 2,
      worklocationname: "ST 701B",
      status: "Active",
    },
    {
      srno: "3",
      id: 3,
      worklocationname: "ST 601A",
      status: "Inactive",
    },
    {
      srno: "4",
      id: 4,
      worklocationname: "ST 701B",
      status: "Active",
    },
  ];

  const [openModal, setOpenModal] = useState(false);
  
    const handleCloseModal = () => {
      setOpenModal(false);
    };

  const handleAddLocation = () => {
    setOpenModal(true);
  };

  return (
    <>
      <div>
        <AgTable
          search={true}
          searchColumn={"Work Location"}
          tableTitle={"Work Location List"}
          buttonTitle={"Add Work Location"}
          data={rows}
          columns={departmentsColumn}
          handleClick={handleAddLocation}
        />
      </div>

    <MuiModal open={openModal} onClose={handleCloseModal} title={"Add Work Location"}>
      <span>hello</span>
    </MuiModal>
      
    </>
  );
};

export default WorkLocations;
