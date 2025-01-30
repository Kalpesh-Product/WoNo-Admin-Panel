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

const MeetingDashboard = () => {
  const meetingInternalColumns = [
    { id: "id", label: "ID", align: "left" },
    { id: "company", label: "Company", align: "left" },
    { id: "meetingRooms", label: "Meeting Rooms", align: "left" },
    { id: "location", label: "Location", align: "left" },
    { id: "endTime", label: "End Time", align: "left" },
  ];

  const meetingInternalRows = [
    {
      id: 1,
      company: "Zomato",
      meetingRooms: "Baga",
      location: "ST-701",
      endTime: "02:30 PM",
    },
    {
      id: 2,
      company: "SquadStack",
      meetingRooms: "Atlantis",
      location: "ST-501",
      endTime: "03:00 PM",
    },
    {
      id: 3,
      company: "Axis Bank",
      meetingRooms: "Vatican",
      location: "ST-601",
      endTime: "03:45 PM",
    },
    {
      id: 4,
      company: "CloudNet",
      meetingRooms: "Calangute",
      location: "ST-701",
      endTime: "04:15 PM",
    },
    {
      id: 5,
      company: "IBDO",
      meetingRooms: "Miami",
      location: "ST-601",
      endTime: "04:45 PM",
    },
    {
      id: 6,
      company: "Turtlemint",
      meetingRooms: "Arambol",
      location: "ST-701",
      endTime: "05:30 PM",
    },
    {
      id: 7,
      company: "Zimetrics",
      meetingRooms: "Colosseum",
      location: "ST-601",
      endTime: "06:00 PM",
    },
  ];
  const meetingExternalRows = [
    {
      id: 1,
      company: "MCaffiene",
      meetingRooms: "Baga",
      location: "ST-701",
      endTime: "02:30 PM",
    },
    {
      id: 2,
      company: "Google",
      meetingRooms: "Atlantis",
      location: "ST-501",
      endTime: "03:00 PM",
    },
    {
      id: 3,
      company: "Facebook",
      meetingRooms: "Vatican",
      location: "ST-601",
      endTime: "03:45 PM",
    },
    {
      id: 4,
      company: "Apple",
      meetingRooms: "Calangute",
      location: "ST-701",
      endTime: "04:15 PM",
    },
    {
      id: 5,
      company: "Netflix",
      meetingRooms: "Miami",
      location: "ST-601",
      endTime: "04:45 PM",
    },
  ];

  const externalGuestsData = [
    {
      name: "Guests Visited",
      data: [45, 32, 60, 75, 80, 55, 90, 20, 50, 40, 70, 85], // Sample guest count per month
    },
  ];

  const externalGuestsOptions = {
    chart: {
      type: "bar",
      fontFamily: "Poppins-Regular",
      toolbar: {
        show: false, // Hide toolbar for cleaner UI
      },
    },
    xaxis: {
      categories: [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
      ], // Financial year months
      title: {
        text: "Financial Year Months",
      },
    },
    yaxis: {
      max: 100, // Maximum count on Y-axis
      title: {
        text: "Guest Count",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "65%",
        borderRadius: 5,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true, // Disable data labels for a cleaner look
      style: {
        fontSize: "12px",
        colors: ["#000"], // Set label color
      },
      offsetY: -22, // Adjust position slightly above the bars
    },
    colors: ["#08b6bc"], // Blue color bars
  };

  const meetings = [
    { meetingId: 1, meetingTime: "30min", mostUsedRoom: "Baga" },
    { meetingId: 2, meetingTime: "1hr", mostUsedRoom: "Baga" },
    { meetingId: 3, meetingTime: "30min", mostUsedRoom: "Aqua" },
    { meetingId: 4, meetingTime: "2hr", mostUsedRoom: "Baga" },
    { meetingId: 5, meetingTime: "1hr", mostUsedRoom: "Aqua" },
    { meetingId: 6, meetingTime: "30min", mostUsedRoom: "Lagoon" },
    { meetingId: 7, meetingTime: "2hr", mostUsedRoom: "Baga" },
    { meetingId: 8, meetingTime: "1hr", mostUsedRoom: "Lagoon" },
    { meetingId: 9, meetingTime: "1hr 30min", mostUsedRoom: "Lagoon" },
    { meetingId: 10, meetingTime: "1hr 30min", mostUsedRoom: "Lagoon" },
    { meetingId: 11, meetingTime: "3hr", mostUsedRoom: "Lagoon" },
    { meetingId: 11, meetingTime: "3hr", mostUsedRoom: "Lagoon" },
  ];

  // To check the number of times a meeting room is booked based on timings
  const durationCount = {};
  meetings.forEach((meeting) => {
    durationCount[meeting.meetingTime] =
      (durationCount[meeting.meetingTime] || 0) + 1;
  });

  // Convert to Pie Chart Data Format
  const meetingPieData = Object.entries(durationCount).map(([time, count]) => ({
    label: time,
    value: count,
  }));

  const meetingPieOptions = {
    labels: meetingPieData.map((item) => item.label), // Show "30min", "1hr", etc. on the chart
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
      formatter: (val) => `${val.toFixed(1)}%`, // Show percentage
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} meetings`, // Tooltip: "X meetings"
      },
    },
  };

  //Room availabilty pie
  // Sample Room Data
  const rooms = [
    { roomID: 1, roomName: "Baga", status: "Available" },
    { roomID: 2, roomName: "Aqua", status: "Unavailable" },
    { roomID: 3, roomName: "Lagoon", status: "Available" },
    { roomID: 4, roomName: "Skyline", status: "Unavailable" },
    { roomID: 5, roomName: "Vista", status: "Available" },
    { roomID: 6, roomName: "Summit", status: "Unavailable" },
    { roomID: 7, roomName: "Horizon", status: "Available" },
  ];

  // 🔹 Process Data for Pie Chart
  const availableRooms = rooms.filter((room) => room.status === "Available");
  const unavailableRooms = rooms.filter(
    (room) => room.status === "Unavailable"
  );

  const RoomPieData = [
    { label: "Available", value: availableRooms.length },
    { label: "Unavailable", value: unavailableRooms.length },
  ];

  // 🔹 ApexCharts Options
  const RoomOptions = {
    chart: {
      fontFamily: "Poppins-Regular",
    },
    labels: RoomPieData.map((item) => item.label), // Labels: Available & Unavailable
    legend: { show: false }, // Hide default ApexCharts legend
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`, // Show percentage
    },
    tooltip: {
      y: {
        formatter: (val, { seriesIndex }) =>
          `${RoomPieData[seriesIndex].label}: ${val} rooms`,
      },
    },
    colors: ["#28a745", "#dc3545"], // Green for Available, Red for Unavailable
  };

  // 🔹 Custom Legend Component
  const CustomLegend = (
    <div>
      <ul>
        {rooms
          .sort((a, b) => (a.status === "Available" ? -1 : 1)) // Sort Available rooms first
          .map((room, index) => (
            <li key={index} className="flex items-center mb-1">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor:
                    room.status === "Available" ? "#28a745" : "#dc3545",
                }}
              ></span>
              {room.roomName}
            </li>
          ))}
      </ul>
    </div>
  );

  const BookingMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Example booked hours data per month
  const actualBookedHoursPerMonth = {
    Jan: 1500,
    Feb: 1600,
    Mar: 1750,
    Apr: 1300,
    May: 1400,
    Jun: 1550,
    Jul: 1650,
    Aug: 1700,
    Sep: 1800,
    Oct: 1900,
    Nov: 1850,
    Dec: 1950,
  };

  // Calculate percentage utilization
  const totalBookableHours = 1980;
  const data = Object.keys(actualBookedHoursPerMonth).map((month) => ({
    x: month,
    y: (actualBookedHoursPerMonth[month] / totalBookableHours) * 100,
  }));

  const averageBookingSeries = [{ name: "Booking Utilization", data }];

  const averageBookingOptions = {
    chart: { type: "bar", fontFamily: "Poppins-Regular" },
    xaxis: { categories: BookingMonths },
    yaxis: {
      max: 100,
      title: { text: "Utilization (%)" },
      labels: {
        formatter: function (value) {
          return Math.round(value) + "%"; // Removes decimals
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + "%"; // Display percentage without decimals
      },
      style: {
        fontSize: "11px",
        colors: ["#00000"], // White color for visibility inside bars
      },
      offsetY: -22,
    },
    plotOptions: {
      bar: {
        dataLabels: {
          position: "top", // Places labels inside the bar
        },
        borderRadius: 5,
        columnWidth: "40%",
      },
    },
    annotations: {
      yaxis: [
        {
          y: 100, // Line at 100%
          borderColor: "#ff0000", // Red color for visibility
          strokeDashArray: 4, // Dashed line
          label: {
            text: "100% Utilization",
            position: "center",
            offsetX: 10,
            style: {
              color: "#ff0000",
              fontWeight: "bold",
            },
          },
        },
      ],
    },
  };

  const meetingsWidgets = [
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={1} border title={"Average Meeting Room Bookings"}>
          <BarGraph
            data={averageBookingSeries}
            options={averageBookingOptions}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 6,
      widgets: [
        <Card
          route={"/app/meetings/book-meeting"}
          title={"Book a Meeting"}
          icon={<RiPagesLine />}
        />,
        <Card
          route={"/app/meetings/manage-meetings"}
          title={"Manage Meetings"}
          icon={<RiArchiveDrawerLine />}
        />,
        <Card
          route={"/app/meetings/calendar"}
          title={"Calendar"}
          icon={<MdFormatListBulleted />}
        />,
        <Card
          route={"/app/meetings/reports"}
          title={"Reports"}
          icon={<CgProfile />}
        />,
        <Card
          route={"/app/meetings/reviews"}
          title={"Reviews"}
          icon={<RiPagesLine />}
        />,
        <Card
          route={"/app/tickets/ticket-settings"}
          title={"Settings"}
          icon={<RiPagesLine />}
        />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard title={"Total"} data={"833"} description={"Hours Booked"} />,
        <DataCard
          title={"Total"}
          data={"75"}
          description={"Unique Bookings"}
        />,
        <DataCard
          title={"Total"}
          data={"55"}
          description={"BIZ Nest Bookings"}
        />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard title={"Total"} data={"20"} description={"Hours Booked"} />,
        <DataCard
          title={"Average"}
          data={"1.2Hrs"}
          description={"Hours Booked"}
        />,
        <DataCard
          title={"Total"}
          data={"135"}
          description={"Hours Cancelled"}
        />,
      ],
    },
    {
      layout: 2,
      widgets: [
        <MuiTable
          Title={"Internal Ongoing Meeting Hourly"}
          rows={meetingInternalRows}
          columns={meetingInternalColumns}
          rowsToDisplay={5}
          scroll={true}
        />,
        <MuiTable
          Title={"External Ongoing Meeting Hourly"}
          rows={meetingExternalRows}
          columns={meetingInternalColumns}
          rowsToDisplay={5}
          scroll={true}
        />,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection
          layout={1}
          border
          title={"External Guests Visited"}
          padding
        >
          <BarGraph data={externalGuestsData} options={externalGuestsOptions} />
        </WidgetSection>,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection layout={1} title={"Meeting Duration Breakdown"} border>
          <PieChartMui data={meetingPieData} options={meetingPieOptions} />
        </WidgetSection>,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection
          layout={1}
          title={"Available v/s Unavailable Room Status (Today)"}
          border
        >
          <PieChartMui
            data={RoomPieData}
            options={RoomOptions}
            customLegend={CustomLegend}
            width={300}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 2,
      widgets: [
        <div className="border-default border-borderGray  rounded-md">
          <div className="">
            <WidgetSection layout={2} title={"Basic Priority Dashboard"}>
              <Card
                title={"MT. AV. Performance"}
                bgcolor={"#60A5F9"}
                data={"70%"}
                titleColor={"white"}
                fontColor={"white"}
                height={"10rem"}
              />
              <Card
                title={"Immediate Attended"}
                data={"12"}
                bgcolor={"#FF0000"}
                titleColor={"white"}
                fontColor={"white"}
                height={"10rem"}
              />
              <Card
                title={"Medium Attended"}
                data={"10"}
                bgcolor={"#FFBF42"}
                titleColor={"white"}
                fontColor={"white"}
                height={"10rem"}
              />
              <Card
                title={"Low Attended"}
                data={"26"}
                bgcolor={"#01D870"}
                titleColor={"white"}
                fontColor={"white"}
                height={"10rem"}
              />
            </WidgetSection>
          </div>
        </div>,

        <div className=" rounded-md flex flex-col gap-4">
          <div className="border-default border-borderGray rounded-md">
            <WidgetSection layout={3} title={"Department Tickets List"}>
              <Card
                title={"Open Tickets"}
                titleColor={"#1E3D73"}
                data={"200"}
                fontColor={"red"}
                fontFamily={"Poppins-Bold"}
              />
              <Card
                title={"Closed Tickets"}
                titleColor={"#1E3D73"}
                data={"75"}
                fontColor={"#52CE71"}
                fontFamily={"Poppins-Bold"}
              />
              <Card
                title={"Pending Tickets"}
                titleColor={"#1E3D73"}
                data={"100"}
                fontColor={"#FFBF42"}
                fontFamily={"Poppins-Bold"}
              />
            </WidgetSection>
          </div>
          <div className="border-default border-borderGray rounded-md">
            <WidgetSection layout={3} title={"Personal Tickets List"}>
              <Card
                title={"Accepted Tickets"}
                data={"106"}
                fontColor={"#1E3D73"}
                fontFamily={"Poppins-Bold"}
                titleColor={"#1E3D73"}
              />
              <Card
                title={"Assigned Tickets"}
                data={"65"}
                fontColor={"#1E3D73"}
                fontFamily={"Poppins-Bold"}
                titleColor={"#1E3D73"}
              />
              <Card
                title={"Escalated Tickets"}
                data={"50"}
                fontColor={"#1E3D73"}
                fontFamily={"Poppins-Bold"}
                titleColor={"#1E3D73"}
              />
            </WidgetSection>
          </div>
        </div>,
      ],
    },
  ];
  return (
    <div>
      <div>
        {meetingsWidgets.map((widget, index) => (
          <div>
            <WidgetSection key={index} layout={widget.layout}>
              {widget?.widgets}
            </WidgetSection>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingDashboard;
