import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AgTable from "../../../../components/AgTable";
import clearImage from "../../../../assets/biznest/clear-seats.png";
import occupiedImage from "../../../../assets/biznest/occupied-seats.png";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
} from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";

const Desks = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(0); // default open the first one (index 0)

  const handleChange = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  const viewEmployeeColumns = [
    { field: "totalSeats", headerName: "Total Seats" },
    { field: "bookedSeats", headerName: "Booked Seats" },
    { field: "occupancy", headerName: "Occupancy %", flex: 1 },
    { field: "availableSeats", headerName: "Available Seats", flex: 1 },
  ];

  const rows = [
    {
      totalSeats: "8",
      bookedSeats: "4",
      occupancy: "50%",
      availableSeats: "4",
    },
  ];
  const currentRoomData = [
    { id: 1, title: "Occupied", image: occupiedImage },
    { id: 2, title: "Available", image: clearImage },
  ];

  return (
    <div>
      <div className="w-full ">
        {/* <div className="">
          <div className="py-2 text-center">
            <p className="text-primary text-lg font-bold">Occupied</p>
          </div>
          <div>
            <img
              className="w-full h-[80%] object-contain cursor-pointer"
              src={occupiedImage}
              alt="Image"
            />
          </div>
        </div>
        <div className="">
          <div className="py-2 text-center">
            {" "}
            <p className="text-primary text-lg font-bold">Clear</p>
          </div>
          <div>
            <img
              // className="w-[90%] h-[80%] object-contain cursor-pointer"
              className="w-full h-[80%] object-contain cursor-pointer"
              src={clearImage}
              alt="Image"
            />
          </div>
        </div> */}
        {currentRoomData.map((item, index) => (
          <Accordion
            expanded={expanded === index}
            onChange={handleChange(index)}
          >
            <AccordionSummary
              expandIcon={<IoIosArrowDown />}
              id={index}
              sx={{ borderBottom: "1px solid #d1d5db" }}
            >
              <div className="p-2 w-full flex justify-between items-center">
                <span className="text-subtitle">{item.title}</span>
                {rows.map((row, index) => (
                  <span key={index} className="text-subtitle">
                    {item.title === "Occupied"
                      ? row.totalSeats
                      : row.availableSeats}
                  </span>
                ))}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="w-full flex flex-col gap-4">
                <div className="flex justify-center items-center">
                  <img
                    className="w-[50%] h-[80%] object-contain cursor-pointer"
                    src={occupiedImage}
                    alt="Image"
                  />
                </div>
                <AgTable
                  search={true}
                  searchColumn="Email"
                  data={rows}
                  columns={viewEmployeeColumns}
                  tableHeight={150}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default Desks;
