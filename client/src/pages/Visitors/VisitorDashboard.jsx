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
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  assetAvailabilityData,
  assetCategoriesData,
  departmentPieData,
  departmentPieOptions,
  recentAssetsColumns,
  recentAssetsData,
} from "../Assets/AssetsData/Data";
import {
  assetAvailabilityDataV,
  assetAvailabilityOptionsV,
  assetCategoriesDataV,
  departmentPieDataVX,
  departmentPieOptionsVX,
  recentAssetsColumnsVX,
  recentAssetsDataVX,
} from "./VisitorsData/VisitorsData";

const VisitorDashboard = () => {
  const axios = useAxiosPrivate();

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/users/fetch-users");
        return response.data;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });

  // Fetch internal meetings
  const { data: meetingsInternal = [] } = useQuery({
    queryKey: ["meetingsInternal"],
    queryFn: async () => {
      const response = await axios.get(
        "/api/meetings/get-meetings-type?type=Internal"
      );

      const parseTime = (timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes; // Convert to total minutes for comparison
      };

      const sortedMeetings = response.data.sort(
        (a, b) => parseTime(a.endTime) - parseTime(b.endTime)
      );

      const formattedMeetings = sortedMeetings.map((meeting, index) => ({
        srNo: index + 1, // Assign serial number after sorting
        ...meeting,
      }));

      console.log("Sorted & Formatted Internal Meetings:", formattedMeetings);
      return formattedMeetings;
    },
  });

  // Fetch external meetings
  const { data: meetingsExternal = [] } = useQuery({
    queryKey: ["meetingsExternal"],
    queryFn: async () => {
      const response = await axios.get(
        "/api/meetings/get-meetings-type?type=External"
      );

      const parseTime = (timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        return hours * 60 + minutes; // Convert to total minutes for comparison
      };

      const sortedMeetings = response.data.sort(
        (a, b) => parseTime(a.endTime) - parseTime(b.endTime)
      );

      const formattedMeetings = sortedMeetings.map((meeting, index) => ({
        srNo: index + 1, // Assign serial number after sorting
        ...meeting,
      }));

      console.log("Sorted & Formatted External Meetings:", formattedMeetings);
      return formattedMeetings;
    },
  });

  const meetingColumns = [
    { id: "srNo", label: "ID", align: "left" },
    { id: "company", label: "Company", align: "left" },
    { id: "roomName", label: "Meeting Rooms", align: "left" },
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
    chart: { fontFamily: "Poppins-Regular" },
    labels: meetingPieData.map((item) => item.label), // Show "30min", "1hr", etc. on the chart
    legend: {
      position: "right",
    },
    colors: [
      "#BBDEFB", // Light Blue (darker than before)
      "#90CAF9", // Soft Blue
      "#64B5F6", // Mild Blue
      "#42A5F5", // Medium Blue
      "#1E88E5", // Deep Blue
      "#1565C0", // Dark Blue
    ],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`, // Show percentage
      style: {
        fontSize: "12px",
        colors: ["#ffff"], // Ensure white text for better visibility
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} meetings`, // Tooltip: "X meetings"
      },
    },
  };

  //Room availabilty pie
  // Sample Room Data
  const availabilityRooms = [
    { roomID: 1, roomName: "Baga", status: "Available" },
    { roomID: 2, roomName: "Aqua", status: "Unavailable" },
    { roomID: 3, roomName: "Lagoon", status: "Available" },
    { roomID: 4, roomName: "Skyline", status: "Unavailable" },
    { roomID: 5, roomName: "Vista", status: "Available" },
    { roomID: 6, roomName: "Summit", status: "Unavailable" },
    { roomID: 7, roomName: "Horizon", status: "Available" },
  ];

  // 🔹 Process Data for Pie Chart
  const availableRooms = availabilityRooms.filter(
    (room) => room.status === "Available"
  );
  const unavailableRooms = availabilityRooms.filter(
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
        {availabilityRooms
          .sort((a, b) => (a.status === "Available" ? -1 : 1)) // Sort Available rooms first
          .map((room, index) => (
            <li key={index} className="flex items-center mb-1">
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{
                  backgroundColor:
                    room.status === "Available" ? "#28a745" : "#dc3545",
                }}></span>
              <span className="text-content text-gray-400">
                {room.roomName}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );

  const BookingMonths = [
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

  const averageBookingSeries = [{ name: "Total Visitors", data }];

  const averageBookingOptions = {
    chart: { type: "bar", fontFamily: "Poppins-Regular" },
    xaxis: { categories: BookingMonths },
    yaxis: {
      max: 100,
      title: { text: "Visitors" },
      labels: {
        formatter: function (value) {
          return Math.round(value) + ""; // Removes decimals
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + ""; // Display percentage without decimals
      },
      style: {
        fontSize: "11px",
        colors: ["#ffff"], // White color for visibility inside bars
      },
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
    colors: ["#1E3D73"], // Black color for bars
    // annotations: {
    //   yaxis: [
    //     {
    //       y: 100,
    //       borderColor: "#ff0000",
    //       borderWidth: 3,
    //       strokeDashArray: 0, // Solid line
    //       label: {
    //         text: "100% Utilization",
    //         position: "center",
    //         offsetX: 10,
    //         offsetY: -10,
    //         style: {
    //           color: "#ff0000",
    //           fontWeight: "bold",
    //         },
    //       },
    //     },
    //   ],
    // },
  };

  const rooms = [
    "Baga",
    "Arambol",
    "Sydney",
    "Zurich",
    "Hawaii",
    "Miami",
    "Madrid",
    "Vatican",
  ];
  const totalBookableRoomHours = 198; // 9 hours per day * 22 days

  // Example actual hours booked per room (you can replace these with real data)
  const actualBookedHours = {
    Baga: 150,
    Arambol: 120,
    Sydney: 180,
    Zurich: 160,
    Hawaii: 140,
    Miami: 170,
    Madrid: 110,
    Vatican: 130,
  };

  // Calculate occupancy percentage
  const processedRoomsData = Object.keys(actualBookedHours).map((room) => ({
    x: room,
    y: (actualBookedHours[room] / totalBookableRoomHours) * 100,
  }));

  const averageOccupancySeries = [
    { name: "Average Occupancy", data: processedRoomsData },
  ];

  const averageOccupancyOptions = {
    chart: { type: "bar", fontFamily: "Poppins-Regular" },
    xaxis: { categories: rooms, title: { text: "Rooms" } },
    yaxis: {
      max: 100,
      title: { text: "Occupancy (%)" },
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
        colors: ["#000"], // Black for better visibility
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
    colors: ["#2DC1C6"],
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timeSlots = [
    "8AM-9AM",
    "9AM-10AM",
    "10AM-11AM",
    "11AM-12PM",
    "12PM-1PM",
    "1PM-2PM",
    "2PM-3PM",
    "3PM-4PM",
    "4PM-5PM",
    "5PM-6PM",
    "6PM-7PM",
    "7PM-8PM",
  ];

  // Mock Data: Replace this with real booking data
  const generateRandomData = () =>
    timeSlots.map(() => Math.floor(Math.random() * 20)); // Max 20 bookings

  const heatmapData = timeSlots.map((slot, index) => ({
    name: slot,
    data: days.map((day, dayIndex) => ({
      x: day, // Day of the week
      y: day === "Sun" || day === "Sat" ? 0 : generateRandomData()[index], // No bookings for Sun/Sat
    })),
  }));

  const heatmapOptions = {
    chart: {
      type: "heatmap",
      toolbar: { show: false },
      fontFamily: "Poppins-Regular",
    },
    dataLabels: { enabled: false },
    colors: ["#d1d5db", "#B2FFB2", "#4CAF50", "#2E7D32", "#1B5E20"], // White to Dark Green Scale
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: "#d1d5db", name: "No Bookings" }, // White (No data)
            { from: 1, to: 5, color: "#B2FFB2", name: "Low (1-5)" }, // Light Green
            { from: 6, to: 10, color: "#4CAF50", name: "Moderate (6-10)" }, // Green
            { from: 11, to: 15, color: "#2E7D32", name: "High (11-15)" }, // Dark Green
            { from: 16, to: 20, color: "#1B5E20", name: "Very High (16-20)" }, // Darkest Green
          ],
        },
      },
    },
    xaxis: { categories: days },
    tooltip: {
      y: {
        formatter: (val) => (val > 0 ? `${val} Bookings` : "No Bookings"),
      },
    },
  };

  const columns3 = [
    { id: "ranks", label: "Sr No", align: "left" },
    { id: "employeeName", label: "Visitor", align: "left" },
    { id: "department", label: "To Meet", align: "center" },
    { id: "Performance (%)", label: "Time", align: "center" },
  ];

  const rows3 = [
    {
      ranks: "1",
      employeeName: "John Doe",
      department: "Abrar Shaikh",
      "Performance (%)": "10:00 AM",
    },
    {
      ranks: "2",
      employeeName: "Aman Gupta",
      department: "Abrar Shaikh",
      "Performance (%)": "09:45 AM",
    },
    {
      ranks: 3,
      employeeName: "Jeff Bezos",
      department: "Abrar Shaikh",
      "Performance (%)": "10:00 AM",
    },
    {
      ranks: 4,
      employeeName: "Elon Musk",
      department: "Abrar Shaikh",
      "Performance (%)": "09:45 AM",
    },
    {
      ranks: 5,
      employeeName: "Satya Nadela",
      department: "Abrar Shaikh",
      "Performance (%)": "10:00 AM",
    },
  ];

  // Calculate total and gender-specific counts
  const totalUsers = usersQuery.isLoading ? [] : usersQuery.data.length;

  const maleCount = usersQuery.isLoading
    ? []
    : usersQuery.data.filter((user) => user.gender === "Male").length;

  const femaleCount = usersQuery.isLoading
    ? []
    : usersQuery.data.filter((user) => user.gender === "Female").length;

  const genderData = [
    {
      id: 0,
      value: ((maleCount / totalUsers) * 100).toFixed(2),
      actualCount: maleCount,
      label: "Male",
      color: "#0056B3",
    },
    {
      id: 1,
      value: ((femaleCount / totalUsers) * 100).toFixed(2),
      actualCount: femaleCount,
      label: "Female",
      color: "#FD507E",
    },
  ];

  const genderPieChart = {
    chart: {
      type: "pie",
    },
    labels: ["Male", "Female"], // Labels for the pie slices
    colors: ["#0056B3", "#FD507E"], // Pass colors as an array
    dataLabels: {
      enabled: true,
      position: "center",
      style: {
        fontSize: "14px", // Adjust the font size of the labels
        fontWeight: "bold",
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: "#000",
        opacity: 0.45,
      },
      formatter: function (val) {
        return `${val.toFixed(0)}%`; // Show percentage value in the center
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex }) {
        const item = genderData[seriesIndex]; // Use genderData to fetch the correct item
        return `
          <div style="padding: 5px; font-size: 12px;">
            ${item.label}: ${item.actualCount} visitors
          </div>`;
      },
    },
    legend: {
      position: "right",
      horizontalAlign: "center",
    },
  };

  const meetingsWidgets = [
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={1} border title={"Monthly Visitor Statistics"}>
          <BarGraph
            height={400}
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
          route={"/app/visitors/add-visitor"}
          title={"Add Visitor"}
          icon={<RiPagesLine />}
        />,
        <Card
          route={"/app/visitors/manage-visitors"}
          title={"Manage Visitors"}
          icon={<RiArchiveDrawerLine />}
        />,
        <Card
          route={"/app/visitors/team-members"}
          title={"Team Members"}
          icon={<MdFormatListBulleted />}
        />,
        <Card
          route={"/app/visitors/reports"}
          title={"Reports"}
          icon={<CgProfile />}
        />,
        <Card
          route={"/app/visitors/reviews"}
          title={"Reviews"}
          icon={<RiPagesLine />}
        />,
        <Card
          route={"/app/visitors/settings"}
          title={"Settings"}
          icon={<RiPagesLine />}
        />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard
          title={"Total"}
          data={"30"}
          description={"Checked In Visitors Today"}
        />,
        <DataCard
          title={"Total"}
          data={"20"}
          description={"Checked Out Today"}
        />,
        <DataCard
          title={"Total"}
          data={"10"}
          description={"Yet To Check Out"}
        />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard
          title={"Total"}
          data={"400"}
          description={"Walk In Visits"}
        />,
        <DataCard
          title={"Total"}
          data={"200"}
          description={"Scheduled Visits"}
        />,
        <DataCard
          title={"Total"}
          data={"15"}
          description={"Meeting Booking"}
        />,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection
          layout={1}
          title={"Visitor Categories This Month"}
          border>
          <DonutChart {...assetCategoriesDataV} />
        </WidgetSection>,
        <WidgetSection
          layout={1}
          title={"Checked In v/s Checked Out Visitors Today"}
          border>
          <PieChartMui
            data={assetAvailabilityDataV}
            options={assetAvailabilityOptionsV}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 2,
      widgets: [
        <MuiTable
          Title="Visitors Expected Today"
          columns={columns3}
          rows={rows3}
        />,
        <MuiTable
          Title="Pending Visits Today"
          columns={columns3}
          rows={rows3}
        />,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection title={"Visitor Gender Data"} border>
          <PieChartMui
            percent={true} // Enable percentage display
            title={"Visitor Gender Data"}
            data={genderData} // Pass processed data
            options={genderPieChart}
          />
        </WidgetSection>,
        <WidgetSection layout={1} title={"Department Wise Visits"} border>
          <PieChartMui
            data={departmentPieDataVX}
            options={departmentPieOptionsVX}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={1} padding>
          <MuiTable
            Title="Visitors Today"
            columns={recentAssetsColumnsVX}
            rows={recentAssetsDataVX}
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

export default VisitorDashboard;
