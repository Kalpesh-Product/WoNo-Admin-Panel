import React from "react";
import PrimaryButton from "../../../../components/PrimaryButton";
import AgTable from "../../../../components/AgTable";

const HoildaysEvents = ({ title }) => {
  const holdiayEvents = [
    { field: "holidayEvent", headerName: "Holiday / Event Name",flex:1 },
    { field: "date", headerName: "Date",flex:1 },
  ];

  const rows = [
    {
      holidayEvent: "Republic Day",
      date: "26-01-2025",
    },
    {
      holidayEvent: "Holi",
      date: "17-03-2025",
    },
    {
      holidayEvent: "Independence Day",
      date: "15-08-2025",
    },
    {
      holidayEvent: "Gandhi Jayanti",
      date: "02-10-2025",
    },
    {
      holidayEvent: "Diwali",
      date: "23-10-2025",
    },
    {
      holidayEvent: "Christmas",
      date: "25-12-2025",
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
