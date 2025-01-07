import Card from "../../../components/Card";
import React from "react";
import { useLocation } from "react-router-dom";
import LayerBarGraph from "../../../components/graphs/LayerBarGraph";
import WidgetSection from "../../../components/WidgetSection";
import { MdRebaseEdit } from "react-icons/md";
import { LuHardDriveUpload } from "react-icons/lu";
import { CgWebsite } from "react-icons/cg";
import DataCard from "../../../components/DataCard";
import BarGraph from "../../../components/graphs/BarGraph";

import { SiCashapp } from "react-icons/si";
import { SiGoogleadsense } from "react-icons/si";
import { MdMiscellaneousServices } from "react-icons/md";

const FrontendDashboard = () => {
  const location = useLocation(); //will need to change useLocation and use context for content rendering once the auth is done

  const techWidgets = [
    {
      layout: 1,
      widgets: [<LayerBarGraph title={"Budget v/s Achievements"} />],
    },
    {
      layout: 6,
      widgets: [
        <Card icon={<MdRebaseEdit />} title="Edit Live Theme" />,
        <Card icon={<LuHardDriveUpload />} title="Upload Website" />,
        <Card icon={<CgWebsite />} title="New Themes" />,
        <Card icon={< SiCashapp/>} title="Budget" />,
        <Card icon={<SiGoogleadsense/>} title="Leads" />,
        <Card icon={<MdMiscellaneousServices/>} title="Miscellaneous" />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard
          title={"Projected"}
          data={23}
          description={"Per Unit Cost"}
        />,
        <DataCard title={"Actual"} data={23} description={"Per Unit Cost"} />,
        <DataCard title={"Requested"} data={6000} description={"Pending"} />,
      ],
    },
    {
      layout: 2,
      widgets: [
        <BarGraph
          data={[
            150,
            320,
            450,
            720,
            880,
            910,
            960,
            990,
            1000,
            1110,
            1200,
            1450 // Example random values
          ]} title={"Unique Companies"}
        />,
      ],
    },
  ];

  // Map departments to widget arrays
  const departmentWidgets = {
    "frontend-dashboard": techWidgets,
  };

  // Get department key from location
  const departmentKey = location.pathname.split("/").pop(); // Extracts "frontend-dashboard" or "sales-dashboard"

  // Get widgets for the department, default to an empty array
  const widgets = departmentWidgets[departmentKey] || [];

  return (
    <div>
      {widgets.map((section, index) => (
        <WidgetSection key={index} layout={section?.layout}>
          {section?.widgets}
        </WidgetSection>
      ))}
    </div>
  );
};

export default FrontendDashboard;
