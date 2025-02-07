import React from "react";
import AreaGraph from "../../components/graphs/AreaGraph";
import { RiArchiveDrawerLine, RiPagesLine } from "react-icons/ri";
import { MdFormatListBulleted } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import Card from "../../components/Card";
import DonutChart from "../../components/graphs/DonutChart";
import WidgetSection from "../../components/WidgetSection";
import DataCard from "../../components/DataCard";
import MuiTable from "../../components/Tables/MuiTable";
import BarGraph from "../../components/graphs/BarGraph";
import PieChartMui from "../../components/graphs/PieChartMui";
import HeatMap from "../../components/graphs/HeatMap";
import {
  assetAvailabilityData,
  assetAvailabilityOptions,
  assetCategoriesData,
  assetUtilizationOptions,
  assetUtilizationSeries,
  departmentPieData,
  departmentPieOptions,
  donutSeriesData,
  physicalDigitalOptions,
  physicalDigitalPieData,
  recentAssetsColumns,
  recentAssetsData,
} from "./AssetsData/Data";

const AssetsDashboard = () => {
  const meetingsWidgets = [
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={1} border title={"Assets Value"}>
          <BarGraph
            height={400}
            data={assetUtilizationSeries}
            options={assetUtilizationOptions}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 6,
      widgets: [
        <Card
          route={"/app/assets/categories"}
          title={"Categories"}
          icon={<RiPagesLine />}
        />,
        <Card
          route={"/app/assets/manage-assets"}
          title={"Manage Assets"}
          icon={<RiArchiveDrawerLine />}
        />,
        <Card
          route={"/app/meetings/calendar"}
          title={"Mix Bag"}
          icon={<MdFormatListBulleted />}
        />,
        <Card
          route={"/app/assets/reports"}
          title={"Reports"}
          icon={<CgProfile />}
        />,
        <Card
          route={"/app/meetings/reviews"}
          title={"Reviews"}
          icon={<RiPagesLine />}
        />,
        <Card
          route={"/app/meetings/settings"}
          title={"Settings"}
          icon={<RiPagesLine />}
        />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard title={"Total"} data={"10K"} description={"Assets Owned"} />,
        <DataCard
          title={"Total"}
          data={"75"}
          description={"Assets Categories"}
        />,
        <DataCard title={"Total"} data={"6Cr"} description={"Assets Value"} />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard title={"Total"} data={"9K"} description={"Assets In Use"} />,
        <DataCard
          title={"Total"}
          data={"1K"}
          description={"Unassigned Assets"}
        />,
        <DataCard
          title={"Total"}
          data={"700"}
          description={"Assets Under Maintainance"}
        />,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection layout={1} title={"Asset Availability"} border>
          <PieChartMui
            data={assetAvailabilityData}
            options={assetAvailabilityOptions}
          />
        </WidgetSection>,
        <WidgetSection layout={1} title={"Physical v/s Digital "} border>
          <PieChartMui
            data={physicalDigitalPieData}
            options={physicalDigitalOptions}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={1} padding>
          <MuiTable
            Title="Asset Inventory"
            columns={recentAssetsColumns}
            rows={recentAssetsData}
            rowKey="id"
            rowsToDisplay={5}
            scroll={true}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection layout={1} title={"Asset Availability"} border>
          <PieChartMui
            data={departmentPieData}
            options={departmentPieOptions}
          />
        </WidgetSection>,
        <WidgetSection layout={1} title={"Physical v/s Digital "} border>
          <DonutChart {...assetCategoriesData} />
        </WidgetSection>,
      ],
    },
  ];
  return (
    <div>
      <div className="flex flex-col p-4 gap-4">
        {meetingsWidgets.map((widget, index) => (
          <div>
            <WidgetSection key={index} layout={widget.layout} padding>
              {widget?.widgets}
            </WidgetSection>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetsDashboard;
