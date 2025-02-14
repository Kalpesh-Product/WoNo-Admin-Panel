import React from "react";
import { RiPagesLine } from "react-icons/ri";
import { MdFormatListBulleted, MdMiscellaneousServices } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import Card from "../../components/Card";
import DonutChart from "../../components/graphs/DonutChart";
import WidgetSection from "../../components/WidgetSection";
import DataCard from "../../components/DataCard";
import MuiTable from "../../components/Tables/MuiTable";
import BarGraph from "../../components/graphs/BarGraph";
import PieChartMui from "../../components/graphs/PieChartMui";
import {
  tasksPieChartData,
  tasksPieChartOptions,
  tasksMonthlyData,
  tasksMonthlyOptions,
  departmentPendingData,
  departmentPieChartOptions,
  myTasksColumns,
  myTasksData,
  myTodayMeetingsColumns,
  myTodayMeetingsData,
  recentlyAddedTasksCol,
  recentlyAddedTasksData,
} from "./TasksData";

const TasksDashboard = () => {
  const meetingsWidgets = [
    {
      layout: 1,
      widgets: [
        <WidgetSection
          layout={1}
          border
          title={"Overall Average Tasks Completion"}
        >
          <BarGraph
            height={400}
            data={tasksMonthlyData}
            options={tasksMonthlyOptions}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 6,
      widgets: [
        <Card
          route={"/app/tasks/project-list"}
          title={"Project List"}
          icon={<RiPagesLine />}
        />,
        <Card route={"my-tasklist"} title={"My Task List"} icon={<RiPagesLine />} />,
        <Card
          route={"team-members"}
          title={"Team Members"}
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
        <DataCard title={"Total"} data={"533"} description={"Tasks"} />,
        <DataCard title={"Total"} data={"103"} description={"Pending Tasks"} />,
        <DataCard
          title={"Total"}
          data={"430"}
          description={"Completed Tasks"}
        />,
      ],
    },
    {
      layout: 3,
      widgets: [
        <DataCard title={"Total"} data={"15"} description={"My Projects"} />,
        <DataCard
          title={"Total"}
          data={"78"}
          description={"Tasks Assigned to Me"}
        />,
        <DataCard
          title={"Total"}
          data={"123"}
          description={"Tasks Assigned by Me"}
        />,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection
          layout={1}
          title={"Overall Pending v/s Assigned Tasks"}
          border
        >
          <PieChartMui
            data={tasksPieChartData}
            options={tasksPieChartOptions}
          />
        </WidgetSection>,
        <WidgetSection layout={1} title={"Physical v/s Digital Assets"} border>
          <PieChartMui
            data={departmentPendingData}
            options={departmentPieChartOptions}
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 1,
      widgets: [
        <WidgetSection layout={2} padding>
          <MuiTable
            Title="My Today's Task"
            columns={myTasksColumns}
            rows={myTasksData}
            rowKey="id"
            rowsToDisplay={10}
            scroll={true}
            className="h-full"
          />
          <MuiTable
            Title="My Today's Meeting"
            columns={myTodayMeetingsColumns}
            rows={myTodayMeetingsData}
            rowKey="id"
            rowsToDisplay={10}
            scroll={true}
            className="h-full"
          />
        </WidgetSection>,
      ],
    },
    {
      layout: 2,
      widgets: [
        <WidgetSection layout={1} padding>
          <MuiTable
          Title={"Recently Added tasks"}
            columns={recentlyAddedTasksCol}
            rows={recentlyAddedTasksData}
            rowKey="id"
            rowsToDisplay={10}
            scroll={true}
            className="h-full"
          />
        </WidgetSection>,
        <WidgetSection
          layout={1}
          title={"Asset Categories"}
          border
        ></WidgetSection>,
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

export default TasksDashboard;
