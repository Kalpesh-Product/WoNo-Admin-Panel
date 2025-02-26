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
  financialYearMonths,
  monthlyLeadsData,
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
import { useNavigate } from "react-router-dom";
import ParentRevenue from "./ParentRevenue";

const SalesDashboard = () => {
  const navigate = useNavigate();

  const monthlyLeadsOptions = {
    chart: {
      type: "bar",
      stacked: true, // Enable stacking for domains
      fontFamily:"Poppins-Regular",
      events: {
        dataPointSelection: () => {
          navigate("unique-leads"); // Navigates to the same component for any bar click
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5,
        dataLabels: {
          position: "center",
        },
      },
    },
    xaxis: {
      categories: financialYearMonths,
      title: { text: "Months" },
    },
    yaxis: {
      title: { text: "Lead Count" },
      tickAmount:10,
    },
    legend: { position: "top" },
    dataLabels: { enabled: true },
    tooltip: {
      y: {
        formatter: (val) => `${val} Leads`,
      },
    },
    colors: [
      "#1E3D73", // Dark Blue (Co-Working)
      "#2196F3", // Bright Blue (Meetings)
      "#98F5E1", // Light Mint Green (Virtual Office)
      "#00BCD4", // Cyan Blue (Workation)
      "#1976D2", // Medium Blue (Alt Revenues)
    ],
  };

  const mockSalesData = [
    {
      month: "April",
      actual: 9000,
      projected: 10000,
      adjustedProjected: 0,
      revenueBreakup: [
        {
          client: "Client A",
          revenue: 4500,
          region: "North",
          industry: "Retail",
        },
        {
          client: "Client B",
          revenue: 3500,
          region: "South",
          industry: "Finance",
        },
        {
          client: "Client C",
          revenue: 2000,
          region: "West",
          industry: "Technology",
        },
      ],
    },
    {
      month: "May",
      actual: 0,
      projected: 11000,
      adjustedProjected: 0,
      revenueBreakup: [
        {
          client: "Client D",
          revenue: 5000,
          region: "East",
          industry: "Healthcare",
        },
        {
          client: "Client E",
          revenue: 4000,
          region: "North",
          industry: "Retail",
        },
        {
          client: "Client F",
          revenue: 2100,
          region: "West",
          industry: "Technology",
        },
      ],
    },
    {
      month: "June",
      actual: 8000,
      projected: 12000,
      adjustedProjected: 4000,
      revenueBreakup: [
        {
          client: "Client G",
          revenue: 3000,
          region: "South",
          industry: "E-commerce",
        },
        {
          client: "Client H",
          revenue: 2500,
          region: "West",
          industry: "Logistics",
        },
        {
          client: "Client I",
          revenue: 2500,
          region: "East",
          industry: "Finance",
        },
      ],
    },
    {
      month: "July",
      actual: 7000,
      projected: 10500,
      adjustedProjected: 3500,
      revenueBreakup: [
        {
          client: "Client J",
          revenue: 4000,
          region: "North",
          industry: "Retail",
        },
        {
          client: "Client K",
          revenue: 3000,
          region: "South",
          industry: "Technology",
        },
      ],
    },
    {
      month: "August",
      actual: 9500,
      projected: 11500,
      adjustedProjected: 2000,
      revenueBreakup: [
        {
          client: "Client L",
          revenue: 4500,
          region: "East",
          industry: "Healthcare",
        },
        {
          client: "Client M",
          revenue: 3500,
          region: "West",
          industry: "Real Estate",
        },
        {
          client: "Client N",
          revenue: 1500,
          region: "North",
          industry: "Manufacturing",
        },
      ],
    },
    {
      month: "September",
      actual: 10200,
      projected: 12500,
      adjustedProjected: 2300,
      revenueBreakup: [
        {
          client: "Client O",
          revenue: 5200,
          region: "South",
          industry: "Automobile",
        },
        {
          client: "Client P",
          revenue: 3000,
          region: "North",
          industry: "Retail",
        },
        {
          client: "Client Q",
          revenue: 2000,
          region: "West",
          industry: "Banking",
        },
      ],
    },
    {
      month: "October",
      actual: 11500,
      projected: 13500,
      adjustedProjected: 2000,
      revenueBreakup: [
        {
          client: "Client R",
          revenue: 6000,
          region: "East",
          industry: "Technology",
        },
        {
          client: "Client S",
          revenue: 4000,
          region: "North",
          industry: "Logistics",
        },
        {
          client: "Client T",
          revenue: 1500,
          region: "South",
          industry: "Retail",
        },
      ],
    },
    {
      month: "November",
      actual: 12500,
      projected: 14500,
      adjustedProjected: 2000,
      revenueBreakup: [
        {
          client: "Client U",
          revenue: 5000,
          region: "West",
          industry: "E-commerce",
        },
        {
          client: "Client V",
          revenue: 3500,
          region: "South",
          industry: "Banking",
        },
        {
          client: "Client W",
          revenue: 4000,
          region: "North",
          industry: "Healthcare",
        },
      ],
    },
    {
      month: "December",
      actual: 14000,
      projected: 15500,
      adjustedProjected: 1500,
      revenueBreakup: [
        {
          client: "Client X",
          revenue: 7000,
          region: "East",
          industry: "Technology",
        },
        {
          client: "Client Y",
          revenue: 4000,
          region: "North",
          industry: "Retail",
        },
        {
          client: "Client Z",
          revenue: 3000,
          region: "West",
          industry: "Logistics",
        },
      ],
    },
    {
      month: "January",
      actual: 13000,
      projected: 16500,
      adjustedProjected: 3500,
      revenueBreakup: [
        {
          client: "Client AA",
          revenue: 6000,
          region: "South",
          industry: "Manufacturing",
        },
        {
          client: "Client AB",
          revenue: 5000,
          region: "North",
          industry: "Banking",
        },
        {
          client: "Client AC",
          revenue: 2000,
          region: "West",
          industry: "E-commerce",
        },
      ],
    },
    {
      month: "February",
      actual: 15000,
      projected: 17500,
      adjustedProjected: 2500,
      revenueBreakup: [
        {
          client: "Client AD",
          revenue: 8000,
          region: "East",
          industry: "Technology",
        },
        {
          client: "Client AE",
          revenue: 4000,
          region: "South",
          industry: "Finance",
        },
        {
          client: "Client AF",
          revenue: 3000,
          region: "North",
          industry: "Retail",
        },
      ],
    },
    {
      month: "March",
      actual: 16000,
      projected: 18500,
      adjustedProjected: 2500,
      revenueBreakup: [
        {
          client: "Client AG",
          revenue: 7000,
          region: "West",
          industry: "Logistics",
        },
        {
          client: "Client AH",
          revenue: 6000,
          region: "North",
          industry: "Healthcare",
        },
        {
          client: "Client AI",
          revenue: 3000,
          region: "South",
          industry: "Automobile",
        },
      ],
    },
  ];
  const meetingsWidgets = [
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={1} border title={"Annual Monthly Revenue"}>
          <ParentRevenue salesData={mockSalesData} falseAccordion />
        </WidgetSection>,
      ],
    },
    {
      layout: 6,
      widgets: [
        <Card
          route={"actual-business"}
          title={"Actual Business"}
          icon={<RiPagesLine />}
        />,
        <Card
          route={"revenue-target"}
          title={"Target"}
          icon={<RiPagesLine />}
        />,
        <Card
          route={"/app/dashboard/sales-dashboard/finance"}
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
          route={"co-working-seats"}
          title={"Total"}
          data={"1000"}
          description={"Co-working Seats"}
        />,
        <DataCard
          route={"co-working-seats"}
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
        <WidgetSection layout={1} title={"India-wise Members"} border>
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
