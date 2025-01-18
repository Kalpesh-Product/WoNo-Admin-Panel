import React from "react";
import WidgetSection from "../../../../../components/WidgetSection";
import ScatterGraph from "../../../../../components/graphs/ScatterGraph";

const Attendance = () => {
  return (
    <div>
      <div className="border-default border-borderGray rounded-md">
        <WidgetSection layout={1} title={"Current Month"}>
          <ScatterGraph />
        </WidgetSection>
      </div>
    </div>
  );
};

export default Attendance;
