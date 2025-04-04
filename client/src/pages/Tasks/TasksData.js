import { Avatar, AvatarGroup, Button, Chip } from "@mui/material";
import PrimaryButton from "../../components/PrimaryButton";

// ----------------------------- Bar Graph Task allocation Start --------------------------- //

// Parent Component - Data Preparation
const financialMonths = [
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

const departments = [
  {
    department: "Tech",
    tasksAllocated: [60, 45, 50, 70, 65, 55, 75, 80, 90, 85, 60, 70],
    tasksCompleted: [40, 42, 47, 65, 60, 50, 70, 75, 85, 80, 55, 65],
  },
  {
    department: "IT",
    tasksAllocated: [50, 40, 55, 65, 70, 60, 80, 85, 95, 75, 55, 60],
    tasksCompleted: [45, 38, 50, 60, 68, 55, 75, 80, 90, 70, 50, 55],
  },
  {
    department: "HR",
    tasksAllocated: [30, 25, 35, 40, 45, 38, 50, 55, 60, 50, 30, 40],
    tasksCompleted: [28, 22, 33, 38, 43, 35, 48, 52, 58, 47, 28, 38],
  },
];

// Calculate Total Allocated and Completed Tasks for each month
const totalAllocated = financialMonths.map((_, index) =>
  departments.reduce((sum, dept) => sum + dept.tasksAllocated[index], 0)
);

const totalCompleted = financialMonths.map((_, index) =>
  departments.reduce((sum, dept) => sum + dept.tasksCompleted[index], 0)
);

// Calculate Pending Tasks
const totalPending = totalAllocated.map(
  (allocated, index) => allocated - totalCompleted[index]
);

// Convert to percentage
const completionPercentage = totalAllocated.map((allocated, index) =>
  allocated > 0 ? (totalCompleted[index] / allocated) * 100 : 0
);

const pendingPercentage = totalAllocated.map((allocated, index) =>
  allocated > 0 ? (totalPending[index] / allocated) * 100 : 0
);
const tasksMonthlyOptions = {
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    fontFamily: "Poppins-regular",
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "40%",
      borderRadius: [5],
      borderRadiusWhenStacked: "all",
      borderRadiusApplication: "end",
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val.toFixed(0)}`,
  },
  xaxis: {
    categories: financialMonths,
  },
  yaxis: {
    title: {
      text: "Department-wise completion (%)",
    },
    labels: {
      formatter: (val) => `${val.toFixed(0)}%`,
    },
    max: 100,
  },
  fill: {
    opacity: 1,
  },
  legend: {
    show: true,
    position: "top",
  },
  colors: ["#28a745", "#dc3545"], // Green for completed, Red for pending
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      const totalAssigned = totalAllocated[dataPointIndex];
      const totalCompletedTasks = totalCompleted[dataPointIndex];
      const totalPendingTasks = totalPending[dataPointIndex];

      return `
        <div style="padding: 2px 8px; background: white; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0,0,0,0.2); font-size: 12px;">
      <div style="display: flex; flex-direction:column; gap:0.5rem">
          <div style="display: flex; gap:1rem; align-items: center;">
          <strong>Total Assigned</strong>
          <strong>:</strong>
          <span>${totalAssigned}</span> 
        </div>
     
            <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong>Total Completed</strong>
          <strong>:</strong>
          <span>${totalCompletedTasks}</span> 
        </div>
    
         <hr/>
          <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong>Total Pending</strong>
          <strong>:</strong>
          <span>${totalPendingTasks}</span> 
        </div>
      </div>
        </div>
      `;
    },
  },
};

// Pass data to BarGraph
const tasksMonthlyData = [
  {
    name: "Completed",
    data: completionPercentage,
  },
  {
    name: "Pending",
    data: pendingPercentage,
  },
];
// ----------------------------- Bar Graph Task allocation End --------------------------- //

//---------------Pie Chart Task Allocation Start------------------------------------------//

// Get the latest month (last entry in financialMonths)
const currentMonthIndex = financialMonths.length - 1;
const currentMonth = financialMonths[currentMonthIndex];

// Get total allocated, completed, and pending for the latest month
const totalAllocatedPie = departments.reduce(
  (sum, dept) => sum + dept.tasksAllocated[currentMonthIndex],
  0
);
const totalCompletedPie = departments.reduce(
  (sum, dept) => sum + dept.tasksCompleted[currentMonthIndex],
  0
);
const totalPendingPie = totalAllocatedPie - totalCompletedPie;

// Calculate percentages
const completedPercentagePie =
  totalAllocatedPie > 0 ? (totalCompletedPie / totalAllocatedPie) * 100 : 0;
const pendingPercentagePie =
  totalAllocatedPie > 0 ? (totalPendingPie / totalAllocatedPie) * 100 : 0;

// Data for Pie Chart
const tasksPieChartData = [
  { label: "Completed", value: completedPercentagePie },
  { label: "Pending", value: pendingPercentagePie },
];

// Pie Chart Options
const tasksPieChartOptions = {
  chart: {
    type: "pie",
  },
  labels: ["Completed", "Pending"],
  colors: ["#28a745", "#dc3545"], // Green for completed, Red for pending
  legend: {
    position: "right",
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val.toFixed(0)}%`,
  },
  tooltip: {
    y: {
      formatter: (val) => `${val.toFixed(1)}%`, // Show percentage with 1 decimal
    },
  },
};

// Custom Legend
const tasksPieCustomLegend = (
  <div className="flex flex-col items-start">
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 bg-[#28a745] rounded-full"></div>
      <span>Completed: {completedPercentagePie.toFixed(0)}%</span>
    </div>
    <div className="flex items-center gap-2 mt-2">
      <div className="w-4 h-4 bg-[#dc3545] rounded-full"></div>
      <span>Pending: {pendingPercentagePie.toFixed(0)}%</span>
    </div>
  </div>
);

//---------------Pie Chart Task Allocation End------------------------------------------//

// -----------------------Pie Chart Pending Start--------------------//
// Calculate department-wise pending percentages
const departmentPendingData = departments.map((dept) => {
  const allocated = dept.tasksAllocated[currentMonthIndex];
  const completed = dept.tasksCompleted[currentMonthIndex];
  const pending = allocated - completed;
  const pendingPercentage = allocated > 0 ? (pending / allocated) * 100 : 0;

  return {
    label: dept.department,
    value: pendingPercentage,
  };
});

// Pie Chart Options
const departmentPieChartOptions = {
  chart: {
    type: "pie",
  },
  labels: departmentPendingData.map((d) => d.label),
  colors: ["#FF5733", "#FFC300", "#36A2EB"], // Different colors for each department
  legend: {
    position: "right",
  },
  tooltip: {
    y: {
      formatter: (val) => `${val.toFixed(1)}%`, // Show percentage with 1 decimal
    },
  },
};

// -----------------------Pie Chart Pending End--------------------//

// -----------------------My Tasks Start--------------------

const myTasksColumns = [
  { id: "id", label: "ID" },
  { id: "task", label: "Task" },
  {
    id: "type",
    label: "Type",
    renderCell: (row) => (
      <Chip
        label={row.type}
        sx={{ backgroundColor: "#d1d5db", color: "#1E3D73" }}
      />
    ),
  },

  { id: "dueTime", label: "Due" },
];

const myTasksData = [
  {
    id: "1",
    task: "Update project documentation",
    type: "Daily",
    due: "10:00 AM",
  },
  {
    id: "2",
    task: "Fix login authentication bug",
    type: "Additional",
    due: "11:30 AM",
  },
  { id: "3", task: "Review pull requests", type: "Daily", due: "02:00 PM" },
  {
    id: "4",
    task: "Implement dashboard UI changes",
    type: "Additional",
    due: "04:00 PM",
  },
  {
    id: "5",
    task: "Optimize database queries",
    type: "Daily",
    due: "06:30 PM",
  },
];

// -----------------------My Tasks End--------------------//

// -----------------------My Todays Meetings Start--------------------

const myTodayMeetingsColumns = [
  { id: "id", label: "ID" },
  { id: "meeting", label: "Meeting" },
  { id: "location", label: "Location" },
  {
    id: "participants",
    label: "Participants",
    align: "center",
    renderCell: (row) => (
      <AvatarGroup max={4}>
        {row.participants.map((participant, index) => (
          <Avatar
            key={index}
            alt={participant.firstName}
            // src={participant.avatar}
            src="https://ui-avatars.com/api/?name=Alice+Johnson&background=random"
            sx={{ width: 23, height: 23 }}
          />
        ))}
      </AvatarGroup>
    ),
  },
  { id: "time", label: "Time" },
];

const myTodayMeetingsData = [
  {
    id: "1",
    meeting: "Mockup Meeting",
    location: "Baga",
    participants: [
      {
        name: "Alice Johnson",
        avatar:
          "https://ui-avatars.com/api/?name=Alice+Johnson&background=random",
      },
      {
        name: "Bob Smith",
        avatar: "https://ui-avatars.com/api/?name=Bob+Smith&background=random",
      },
      {
        name: "Charlie Brown",
        avatar:
          "https://ui-avatars.com/api/?name=Charlie+Brown&background=random",
      },
    ],
    time: "10:00 AM",
  },
  {
    id: "2",
    meeting: "Frontend Meeting",
    location: "Arambol",
    participants: [
      {
        name: "David Lee",
        avatar: "https://ui-avatars.com/api/?name=David+Lee&background=random",
      },
      {
        name: "Emma Watson",
        avatar:
          "https://ui-avatars.com/api/?name=Emma+Watson&background=random",
      },
      {
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
      },
      {
        name: "Sarah Connor",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Connor&background=random",
      },
    ],
    time: "11:30 AM",
  },
  {
    id: "3",
    meeting: "Backend Meeting",
    location: "Hawaii",
    participants: [
      {
        name: "Michael Scott",
        avatar:
          "https://ui-avatars.com/api/?name=Michael+Scott&background=random",
      },
      {
        name: "Pam Beesly",
        avatar: "https://ui-avatars.com/api/?name=Pam+Beesly&background=random",
      },
    ],
    time: "02:00 PM",
  },
  {
    id: "4",
    meeting: "Feedback Meeting",
    location: "Zurich",
    participants: [
      {
        name: "Rachel Green",
        avatar:
          "https://ui-avatars.com/api/?name=Rachel+Green&background=random",
      },
      {
        name: "Monica Geller",
        avatar:
          "https://ui-avatars.com/api/?name=Monica+Geller&background=random",
      },
      {
        name: "Joey Tribbiani",
        avatar:
          "https://ui-avatars.com/api/?name=Joey+Tribbiani&background=random",
      },
    ],
    time: "04:00 PM",
  },
  {
    id: "5",
    meeting: "HR Meeting",
    location: "Vagator",
    participants: [
      {
        name: "Ross Geller",
        avatar:
          "https://ui-avatars.com/api/?name=Ross+Geller&background=random",
      },
      {
        name: "Chandler Bing",
        avatar:
          "https://ui-avatars.com/api/?name=Chandler+Bing&background=random",
      },
      {
        name: "Phoebe Buffay",
        avatar:
          "https://ui-avatars.com/api/?name=Phoebe+Buffay&background=random",
      },
    ],
    time: "06:30 PM",
  },
];

// -----------------------My Todays Meetings End--------------------//

// -----------------------Recently Added Tasks Start--------------------//

const recentlyAddedTasksCol = [
  { id: "id", label: "ID" },
  { id: "task", label: "Task" },
  {
    id: "type",
    label: "Type",
    align: "center",
    renderCell: (row) => (
      <Chip
        sx={{ backgroundColor: "#d1d5db", color: "#1E3D73" }}
        label={row.type}
      />
    ),
  },
  { id: "due", label: "Due" },
];

const recentlyAddedTasksData = [
  {
    id: "1",
    task: "Complete Frontend Dashboard",
    type: "Monthly",
    due: "10:00 AM",
  },
  {
    id: "2",
    task: "R&D on AWS",
    type: "Additional",
    due: "11:30 AM",
  },
  {
    id: "3",
    task: "Complete Onboarding Module",
    type: "Monthly",
    due: "02:00 PM",
  },
  {
    id: "4",
    task: "Push to GitHub",
    type: "Daily",
    due: "04:00 PM",
  },
  {
    id: "5",
    task: "Complete Meetings Dashboard",
    type: "Daily",
    due: "06:30 PM",
  },
];

// -----------------------Recently Added tasks End--------------------//

// -----------------------Asset categories Donut Data Start--------------------
const assetCategoriesData = {
  labels: ["Chairs", "Printers", "Bottles", "Markers"],
  series: [30, 25, 20, 25], // Example percentage distribution
  colors: ["#FF5733", "#FFC300", "#36A2EB", "#4CAF50"], // Example colors for each category
  centerLabel: "Assets",
  title: "Asset Categories Distribution",
};

// -----------------------Asset categories Donut Data End--------------------
// -----------------------Recently Added Assets Start--------------------
const recentAssetsColumns = [
  { id: "id", label: "ID" },
  { id: "department", label: "Department" },
  { id: "assetNumber", label: "Asset Number" },
  { id: "category", label: "Category" },
  { id: "brand", label: "Brand" },
  { id: "price", label: "Price", align: "right" },
  { id: "quantity", label: "Quantity", align: "right" },
  { id: "purchaseDate", label: "Purchase Date" },
  { id: "warranty", label: "Warranty (Months)" },
  {
    id: "actions",
    label: "Actions",
    align: "center",
    renderCell: () => <PrimaryButton title={"Details"} />,
  },
];

const recentAssetsData = [
  {
    id: 1,
    department: "HR",
    assetNumber: "L0001",
    category: "Laptop",
    brand: "Lenovo",
    price: "₹55,000",
    quantity: 2,
    purchaseDate: "02/01/2025",
    warranty: 12,
  },
  {
    id: 2,
    department: "IT",
    assetNumber: "P0002",
    category: "Printer",
    brand: "HP",
    price: "₹15,000",
    quantity: 1,
    purchaseDate: "15/02/2025",
    warranty: 24,
  },
  {
    id: 3,
    department: "Finance",
    assetNumber: "C0003",
    category: "Chair",
    brand: "Godrej",
    price: "₹5,000",
    quantity: 4,
    purchaseDate: "10/03/2025",
    warranty: 36,
  },
  {
    id: 4,
    department: "Marketing",
    assetNumber: "B0004",
    category: "Bottle",
    brand: "Milton",
    price: "₹700",
    quantity: 10,
    purchaseDate: "20/04/2025",
    warranty: 12,
  },
  {
    id: 5,
    department: "HR",
    assetNumber: "M0005",
    category: "Marker",
    brand: "Camlin",
    price: "₹50",
    quantity: 25,
    purchaseDate: "05/05/2025",
    warranty: 6,
  },
  {
    id: 6,
    department: "Admin",
    assetNumber: "D0006",
    category: "Desk",
    brand: "IKEA",
    price: "₹12,000",
    quantity: 3,
    purchaseDate: "12/06/2025",
    warranty: 24,
  },
  {
    id: 7,
    department: "Operations",
    assetNumber: "S0007",
    category: "Scanner",
    brand: "Canon",
    price: "₹18,000",
    quantity: 1,
    purchaseDate: "25/07/2025",
    warranty: 18,
  },
];
// -----------------------Recently Added Assets End--------------------

export {
  tasksMonthlyData,
  tasksMonthlyOptions,
  tasksPieChartData,
  tasksPieChartOptions,
  tasksPieCustomLegend,
  myTasksColumns,
  myTasksData,
  departmentPendingData,
  departmentPieChartOptions,
  myTodayMeetingsColumns,
  myTodayMeetingsData,
  recentlyAddedTasksCol,
  recentlyAddedTasksData,
};
