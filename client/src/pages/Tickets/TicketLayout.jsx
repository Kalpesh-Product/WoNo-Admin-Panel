import React from "react";
import WidgetSection from "../../components/WidgetSection";
import AreaGraph from "../../components/graphs/AreaGraph";
import Card from "../../components/Card";
import DonutChart from "../../components/graphs/DonutChart";
import { RiArchiveDrawerLine } from "react-icons/ri";
import { RiPagesLine } from "react-icons/ri";
import { MdFormatListBulleted } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Outlet } from "react-router-dom";

const TicketLayout = () => {
  return (
    <div>

      {/* Render child routes */}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default TicketLayout;
