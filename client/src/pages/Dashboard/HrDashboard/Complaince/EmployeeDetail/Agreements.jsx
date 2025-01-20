import React from "react";
import AgTable from "../../../../../components/AgTable";

const Agreements = () => {
  const agreementColumn = [
    { field: "agreementName", headerName: "Agreement Name", flex:1 },
    { field: "date", headerName: "Date" },
  ];

  const rows = [
    {
      id: 1,
      agreementName: "Internship Agreement",
      date: "2025-01-01",
    },
    {
      id: 2,
      agreementName: "Travel Allowance Agreement",
      date: "2025-02-15",
    },
    {
      id: 3,
      agreementName: "Manager Agreement",
      date: "2025-03-10",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <AgTable
          search={true}
          searchColumn={"Agreement Name"}
          tableTitle={"Aiwin's Agreement List"}
          buttonTitle={"Add Agreement"}
          data={rows}
          columns={agreementColumn}
        />
      </div>
    </div>
  );
};

export default Agreements;
