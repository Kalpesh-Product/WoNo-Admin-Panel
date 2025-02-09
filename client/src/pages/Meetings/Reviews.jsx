import React, { useState } from "react";
import WidgetSection from "../../components/WidgetSection";
import DataCard from "../../components/DataCard";
import AgTable from "../../components/AgTable";
import { Chip } from "@mui/material";
import { PiArrowBendUpLeftBold } from "react-icons/pi";
import { PiArrowBendLeftDownBold } from "react-icons/pi";
import MuiAside from "../../components/MuiAside";
import PrimaryButton from "../../components/PrimaryButton";
import TextField from "@mui/material/TextField";

const Reviews = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [reviewData, setReviewData] = useState({});
  const departmentsColumn = [
    { field: "srno", headerName: "SR No" },
    {
      field: "nameofreview",
      headerName: "Name of Review",
      cellRenderer: (params) => {
        return (
          <Chip label={params.value} style={{ backgroundColor: "white" }} />
        );
      },
      flex: 1,
    },
    { field: "date", headerName: "Date" },
    {
      field: "rate",
      headerName: "Rate",
      cellRenderer: (params) => {
        return (
          <div>
            ⭐ {params.value} <small>Out of 5</small>
          </div>
        );
      },
    },
    {
      field: "Reviews",
      headerName: "Review",
      flex: 2,
      cellStyle: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      tooltipField: "Reviews",
    },
    {
      field: "action",
      headerName: "Actions",
      cellRenderer: (params) => {
        const statusColorMap = {
          "Reply Review": { backgroundColor: "#E8FEF1", color: "#527160" }, // Light orange bg, dark orange font
          Replied: { backgroundColor: "#EAEAEA", color: "#868686" }, // Light green bg, dark green font
        };

        const { backgroundColor, color } = statusColorMap[params.value] || {
          backgroundColor: "gray",
          color: "white",
        };

        const handleClick = () => {
          if (params.value === "Reply Review") {
            // Trigger modal open when "Reply Review" is clicked
            setOpenSidebar(true);
            setReviewData(params.data); // Optional: You can pass the row data to the modal
          }
        };

        return (
          <>
            <Chip
              label={
                params.value === "Reply Review" ? (
                  <div
                    className="flex flex-row items-center justify-center gap-2"
                    onClick={handleClick}
                  >
                    <PiArrowBendLeftDownBold />
                    {params.value}
                  </div>
                ) : (
                  <div className="flex flex-row items-center justify-center gap-2">
                    <PiArrowBendUpLeftBold />
                    {params.value}
                  </div>
                )
              }
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
  ];

  const rows = [
    {
      srno: "1",
      nameofreview: "Raiders Kai",
      date: "20 Dec,2024",
      rate: "4.9",
      Reviews:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, dicta obcaecati temporibus sit beatae repellat natus nesciunt quia cumque magni quibusdam, reprehenderit unde in accusamus. Veniam itaque voluptates ipsam beatae!",
      action: "Reply Review",
    },
    {
      srno: "2",
      nameofreview: "Raiders Kai",
      date: "20 Dec,2024",
      rate: "4.4",
      Reviews: "ccfcfcccf",
      action: "Replied",
    },
    {
      srno: "3",
      nameofreview: "Raiders Kai",
      date: "20 Dec,2024",
      rate: "3.0",
      Reviews: "ccfcfcccf",
      action: "Reply Review",
    },
    {
      srno: "4",
      nameofreview: "Raiders Kai",
      date: "20 Dec,2024",
      rate: "3.5",
      Reviews: "ccfcfcccf",
      action: "Replied",
    },
  ];

  return (
    <>
      <div>
        <WidgetSection layout={3}>
          <DataCard data="10.0k" title="Total" description="Reviews Count" />
          <DataCard data="4.5⭐" title="Average" description=" Ratings" />
          <DataCard data="10.0k" title="Total" description="Reviews Count" />
        </WidgetSection>

        <div className="p-6">
          <AgTable
            search={true}
            searchColumn={"Policies"}
            data={rows}
            columns={departmentsColumn}
          />
        </div>
        <MuiAside
          open={openSidebar}
          onClose={() => setOpenSidebar(false)}
          title={"Reviews"}
        >
          <div className="p-2">
            <h1 className="font-pmedium text-subtitle">
              {reviewData.nameofreview}
            </h1>
            <div>
              ⭐ {reviewData.rate} <small> out of 5</small>
            </div>
            <div className="mt-10">
              <p>{reviewData.Reviews}</p>
            </div>
            <div className="mt-5">
              <TextField
                type="text"
                id="outlined-multiline-flexible"
                label="Reply"
                fullWidth
                multiline
                rows={5}
              />
            </div>
            <PrimaryButton
              title={"Submit"}
              handleSubmit={() => setOpenSidebar(false)}
              externalStyles={"mt-10"}
            ></PrimaryButton>
          </div>
        </MuiAside>
      </div>
    </>
  );
};

export default Reviews;
