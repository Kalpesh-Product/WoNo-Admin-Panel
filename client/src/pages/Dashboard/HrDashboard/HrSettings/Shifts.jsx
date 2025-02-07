import React from "react";
import AgTable from "../../../../components/AgTable";
import { Chip } from "@mui/material";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";


const Shifts = () => {

  const axios = useAxiosPrivate()

  const { data: shifts = [] } = useQuery({
    queryKey: ["shifts"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/company/get-company-data/shifts");
        return response.data.shifts
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });

  const departmentsColumn = [
    { field:"id" , headerName:"SR NO"},
      { field: "shift", headerName: "Shift List",
        cellRenderer:(params)=>{
          return(
            <div>
              <span className="text-primary cursor-pointer hover:underline">
                {params.value}
              </span>
            </div>
          )
        },flex:1},
    ];
  
  
    const rows = [
      {
        srno:"1",
        id: 1,
        shiftlist:"General Shift",
        status: "Active",
      },
      {
        srno:"2",
        id: 2,
        shiftlist:"Night Shift",
        status: "Active",
      },
      {
        srno:"3",
        id: 3,
        shiftlist:"Afternoon Shift",
        status: "Inactive",
      },
      {
        srno:"4",
        id: 4,
        shiftlist:"Evening Shift",
        status: "Active",
      },
      
    ];
  return (
    <div>
      <AgTable
        search={true}
        searchColumn={"Shifts"}
        tableTitle={"Shift List"}
        buttonTitle={"Add Shift List"}
        data={[
          ...shifts.map((shift, index) => ({
            id: index + 1, // Auto-increment Sr No
            shift: shift
            ,
          })),
        ]}
        columns={departmentsColumn}
      />
    </div>
  );
};

export default Shifts;
