import Card from '../../../components/Card'
import React from "react";
import { useLocation } from "react-router-dom";
import LayerBarGraph from '../../../components/graphs/LayerBarGraph'
import WidgetSection from "../../../components/WidgetSection";
import { MdRebaseEdit } from "react-icons/md";
import { LuHardDriveUpload } from "react-icons/lu";
import { RiApps2AddLine } from "react-icons/ri";
import { CgWebsite } from "react-icons/cg";

import { SiCashapp } from "react-icons/si";
import { SiGoogleadsense } from "react-icons/si";
import { MdMiscellaneousServices } from "react-icons/md";

const FrontendDashboard = () => {
  const location = useLocation(); //will need to change useLocation and use context for content rendering once the auth is done

  const techWidgets = [
    { layout: 1, widgets: [<LayerBarGraph />] },
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
      layout: 4,
      widgets: [
        <Card title="Widget 1" />,
        <Card title="Widget 2" />,
        <Card title="Widget 3" />,
        <Card title="Widget 4" />,
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
  console.log(widgets.map((widget, index)=>{
    console.log("widgets here : ",widget?.widgets)
  }))
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
