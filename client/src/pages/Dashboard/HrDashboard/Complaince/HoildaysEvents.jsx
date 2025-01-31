import React from "react";
import PrimaryButton from "../../../../components/PrimaryButton";
import AgTable from "../../../../components/AgTable";

const HoildaysEvents = ({ title }) => {
  const holdiayEvents = [
    { field: "srno", headerName: "SR No",flex:1 },
    { field: "holidayEvent", headerName: "Holiday / Event Name",flex:1 },
    { field: "date", headerName: "Date",flex:1 },
  ];

  const rows = [
    {
      srno:"1",
      holidayEvent: "New Year 2025",
      date: "01 Jan, 2025",
    },
    {
      srno:"2",
      holidayEvent: "Rebublic Day 2025",
      date: "26 Jan, 2025",
    },
    {
      srno:"3",
      holidayEvent: "Gudi Padava",
      date: "30 Mar, 2025",
    },
    {
      srno:"4",
      holidayEvent: "Eid-Alt-Fitr (Ramadan)",
      date: "31 Mar, 2025",
    },
    {
      srno:"5",
      holidayEvent: "Sankalp's Birthday",
      date: "31 Jan, 2025",
    },
    {
      srno:"6",
      holidayEvent: "Labour Day (May Day)",
      date: "01 May, 2025",
    },
    {
      srno:"7",
      holidayEvent: "Eid Al-Adha (Bakri Eid)",
      date: "07 Jun, 2025",
    },
    {
      srno:"8",
      holidayEvent: "15 Aug 2025",
      date: "15 Aug, 2025",
    },
    {
      srno:"9",
      holidayEvent: "Ganesh Chaturthi (1st Day)",
      date: "27 Aug, 2025",
    },
    {
      srno:"10",
      holidayEvent: "Gandhi Jayanti",
      date: "02 Oct, 2025",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center pb-4">
        <span className="text-title font-pmedium text-primary">{title}</span>
        <PrimaryButton title={"Add Holiday / Event"} />
      </div>

      <div>
        <AgTable search={true} searchColumn={"Holiday / Event Name"} columns={holdiayEvents} data={rows} />
      </div>
    </div>
  );
};

export default HoildaysEvents;
