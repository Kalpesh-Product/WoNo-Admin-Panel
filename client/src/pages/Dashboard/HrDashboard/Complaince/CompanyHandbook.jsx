import React from "react";
import biznestLogo from "../../../../assets/biznest/biznest_logo.jpg";
import HierarchyTree from "../../../../components/HierarchyTree";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import {
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";

const CompanyHandbook = () => {
  const accordionData = [
    {
      id: 1,
      title: "Tech",
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-content">SOP's</span>
            </div>
            <div>
              <button className="p-2 border-default border-black rounded-md text-content">
                <IoIosArrowForward />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-content">Policies</span>
            </div>
            <div>
              <button className="p-2 border-default border-black rounded-md text-content">
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "IT",
      content: (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-content">SOP's</span>
            </div>
            <div>
              <button className="p-2 border-default border-black rounded-md text-content">
                <IoIosArrowForward />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <span className="text-content">Policies</span>
            </div>
            <div>
              <button className="p-2 border-default border-black rounded-md text-content">
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Accordion 3",
      content: "Content for Accordion 3",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex">
        <div className="w-full shadow-md p-4 rounded-md">
          <div className="h-20 w-20 flex flex-col gap-4">
            <img
              className="w-full  object-contain  h-[30%]"
              src={biznestLogo}
              alt="biznestLogo"
            />
            <div>
              <span className="text-content">About</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-full shadow-md p-4 rounded-md">
          <HierarchyTree height={"60vh"} />
        </div>
      </div>

      <div>
        <div className="w-full shadow-md p-4 rounded-md">
          {accordionData.map((item) => (
            <Accordion sx={{boxShadow:'none', border:'1px solid #d1d5db'}}  key={item.id}>
              <AccordionSummary
                expandIcon={<IoIosArrowDown />}
                aria-controls={`panel${item.id}-content`}
                id={`panel${item.id}-header`}
                // sx={{borderBottom:'1px solid #d1d5db'}}
              >
                <span className="text-subtitle">{item.title}</span>
              </AccordionSummary>
              <div className="border-[1px] border-borderGray"></div>
              <AccordionDetails sx={{padding:'1rem'}}>
                <span className="text-content">{item.content}</span>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default CompanyHandbook;
