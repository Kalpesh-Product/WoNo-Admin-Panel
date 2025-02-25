import React from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import AgTable from "../../../../components/AgTable";
import occupied from "../../../../assets/biznest/occupancy/occupied.png";
import cleared from "../../../../assets/biznest/occupancy/cleared.png";

const mockSalesData = [
  {
    client: "Zomato",
    memberDetails: [
      { member: "Member A", date: "2024-02-20" },
      { member: "Member B", date: "2024-02-21" },
      { member: "Member C", date: "2024-02-22" },
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
            <AccordionDetails>
              <AgTable
                data={data.memberDetails}
                columns={[
                  { field: "member", headerName: "Member", flex: 1 },
                  { field: "date", headerName: "Date", flex: 1 },
                ]}
                tableHeight={300}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default ViewAvailability;
