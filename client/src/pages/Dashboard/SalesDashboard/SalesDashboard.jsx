import React from "react";
import { RiArchiveDrawerLine, RiPagesLine } from "react-icons/ri";
import { MdFormatListBulleted, MdMiscellaneousServices } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import Card from "../../../components/Card";
import DonutChart from "../../../components/graphs/DonutChart";
import WidgetSection from "../../../components/WidgetSection";
import DataCard from "../../../components/DataCard";
import MuiTable from "../../../components/Tables/MuiTable";
import BarGraph from "../../../components/graphs/BarGraph";
import PieChartMui from "../../../components/graphs/PieChartMui";
import {
  annualMonthlyRawData,
  totalActualRevenue,
  totalProjectedRevenue,
  monthlyLeadsData,
  monthlyLeadsOptions,
  sourcingChannelsData,
  sourcingChannelsOptions,
  clientOccupancyPieData,
  clientOccupancyPieOptions,
  sectorPieChartData,
  sectorPieChartOptions,
  clientGenderData,
  clientGenderPieChartOptions,
  locationPieChartData,
  locationPieChartOptions,
  companyTableColumns,
  formattedCompanyTableData,
  upcomingBirthdaysColumns,
  upcomingBirthdays,
} from "./SalesData/SalesData";
import RevenueGraph from "../../../components/graphs/RevenueGraph";

const SalesDashboard = () => {
  const meetingsWidgets = [
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={1} border title={"Annual Monthly Revenue"}>
          <RevenueGraph annualMonthlyRawData={annualMonthlyRawData} />
        </WidgetSection>,
      ],
    },
    {
      layout: 6,
      widgets: [
        <Card route={""} title={"Actual Business"} icon={<RiPagesLine />} />,
        <Card route={""} title={"Targets"} icon={<RiPagesLine />} />,
        <Card
          route={""}
          title={"Finance"}
          icon={<MdFormatListBulleted />}
        />,
        <Card route={""} title={"Mix Bag"} icon={<MdFormatListBulleted />} />,
        <Card route={""} title={"Reports"} icon={<CgProfile />} />,
        <Card
          route={""}
          title={"Settings"}
          icon={<MdMiscellaneousServices />}
        />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard
          route={"revenue"}
          title={"Actual"}
          data={"92%"}
          description={"Occupancy"}
        />,
        <DataCard
          route={"revenue"}
          title={"Total"}
          data={"80L"}
          description={"Revenues"}
        />,
        <DataCard
          route={"clients"}
          title={"Unique"}
          data={"400"}
          description={"Clients"}
        />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard
          route={"revenue"}
          title={"Total"}
          data={"1000"}
          description={"Co-working Seats"}
        />,
        <DataCard
          route={"revenue"}
          title={"Booked"}
          data={"800"}
          description={"Co-working Seats"}
        />,
        <DataCard
          route={"revenue"}
          title={"Free"}
          data={"200"}
          description={"Co-working Seats"}
        />,
      ],
    },
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={1} title={"Monthly Unique Leads"} border>
          <BarGraph
            height={400}
            data={monthlyLeadsData}
            options={monthlyLeadsOptions}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={1} title={"Sourcing Channels"} border>
          <BarGraph
            height={400}
            data={sourcingChannelsData}
            options={sourcingChannelsOptions}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection layout={1} title={"Client-wise Occupancy"} border>
          <PieChartMui
            data={clientOccupancyPieData}
            options={clientOccupancyPieOptions}
          />
        </WidgetSection>,
        <WidgetSection layout={1} title={"Sector-wise Occupancy"} border>
          <PieChartMui
            data={sectorPieChartData}
            options={sectorPieChartOptions}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection layout={1} title={"Gender-wise data"} border>
          <PieChartMui
            data={clientGenderData}
            options={clientGenderPieChartOptions}
          />
        </WidgetSection>,
        <WidgetSection layout={1} title={"Sector-wise Occupancy"} border>
          <PieChartMui
            data={locationPieChartData}
            options={locationPieChartOptions}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection layout={1} padding>
          <MuiTable
            Title="Client Anniversary"
            columns={companyTableColumns}
            rows={formattedCompanyTableData}
            rowKey="id"
            rowsToDisplay={10}
            scroll={true}
            className="h-full"
          />
        </WidgetSection>,
        <WidgetSection layout={1} padding>
          <MuiTable
            Title="Client Member Birthday"
            columns={upcomingBirthdaysColumns}
            rows={upcomingBirthdays}
            rowKey="id"
            rowsToDisplay={10}
            scroll={true}
            className="h-full"
          />
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

export default SalesDashboard;
