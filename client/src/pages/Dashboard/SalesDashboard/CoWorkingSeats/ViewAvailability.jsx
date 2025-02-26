import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import AgTable from "../../../../components/AgTable";
import occupied from "../../../../assets/biznest/occupancy/occupied.png";
import cleared from "../../../../assets/biznest/occupancy/cleared.png";
import PrimaryButton from "../../../../components/PrimaryButton";
import MuiModal from "../../../../components/MuiModal";

const mockSalesData = [
  {
    client: "WoNo",
    memberDetails: [
      { member: "Aiwinraj", date: "2024-02-20" },
      { member: "Allan", date: "2024-02-21" },
      { member: "Sankalp", date: "2024-02-22" },
    ],
  },
  {
    client: "Uber Eats",
    memberDetails: [
      { member: "Member X", date: "2024-02-25" },
      { member: "Member Y", date: "2024-02-26" },
    ],
  },
];

const ViewAvailability = () => {
    const [openModal, setOpenModal] = useState(false);
    const [memberDetails, setMemberDetails] = useState({});
  const handleViewDetails = (data) => {
    setOpenModal(true);
    setMemberDetails(data);
  };
  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <div className="grid grid-cols-2  gap-4">
          <div className="flex w-full flex-col gap-4 text-center">
            <span className="text-primary text-title">Occupied</span>
            <div className="h-full w-full object-contain">
              <img className="w-full h-full" src={occupied} alt="" />
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 text-center">
            <span className="text-primary text-title">Clear</span>
            <div lassName="h-40 w-40 object-contain">
              <img className="w-full h-full" src={cleared} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div>
        {mockSalesData.map((data, index) => (
          <Accordion key={index} className="py-4">
            <AccordionSummary
              expandIcon={<IoIosArrowDown />}
              aria-controls={`panel-${index}-content`}
              id={`panel-${index}-header`}
              className="border-b-[1px] border-borderGray"
            >
              <div className="flex justify-between items-center w-full px-4">
                <span className="text-subtitle font-medium">{data.client}</span>
                <span className="text-subtitle font-medium">
                  {data.memberDetails.length} members
                </span>
              </div>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: "1px solid #d1d5db" }}>
              <AgTable
                data={data.memberDetails}
                hideFilter
                columns={[
                  { field: "member", headerName: "Member Name", flex: 1 },
                  { field: "date", headerName: "Date", flex: 1 },
                  {
                    headerName: "Action",
                    field: "action",
                    cellRenderer: (params) => (
                      <>
                        <div className="p-1 flex gap-2">
                          <PrimaryButton
                            title={"View"}
                            handleSubmit={() => handleViewDetails(params.data)}
                          />
                        </div>
                      </>
                    ),
                  },
                ]}
                tableHeight={300}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      <MuiModal
        open={openModal}
        title={"Member Details"}
        onClose={() => {
          setOpenModal(false);
          setMemberDetails({});
        }}
      >
        <div className="grid grid-cols-2 gap-8 px-2 pb-8 border-b-default border-borderGray">
          <div className="flex items-center justify-between">
            <span className="text-content">Member Name</span>
            <span className="text-content text-gray-500">
              {memberDetails.member}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-content">Date of Joining</span>
            <span className="text-content text-gray-500">{memberDetails.date}</span>
          </div>
        </div>
      </MuiModal>
    </div>
  );
};

export default ViewAvailability;
