import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import AgTable from "../../../components/AgTable"; // ✅ Import AgTable

const EditProject = () => {
  const { id } = useParams(); // Get project ID from URL
  const location = useLocation(); // Get project details from state

  const project = location.state?.project; // Extract project data

  if (!project) {
    return <Typography variant="h6">Project not found!</Typography>;
  }

  // ✅ Convert project data: Each assignee becomes a separate row
  const projectData = project.assignees.map((assignee, index) => ({
    id: `${project.id}-${index}`, // Unique ID for AgGrid
    assignee, // Individual assignee
    title: project.title,
    priority: project.priority,
    status: project.status,
    startDate: project.startDate,
    deadline: project.deadline,
  }));

  // ✅ Define AgGrid columns
  const columnDefs = [
    { field: "assignee", headerName: "Assignee", flex: 1 }, // Move Assignees to First Column
    { field: "title", headerName: "Title", flex: 1 },
    { field: "priority", headerName: "Priority", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "startDate", headerName: "Start Date", flex: 1 },
    { field: "deadline", headerName: "Deadline", flex: 1 },
  ];

  return (
    <div className="p-4">
      {/* ✅ Render AgTable with transformed project details */}
      <AgTable
        buttonTitle={"Edit"}
        data={projectData}
        search={true}
        columns={columnDefs}
        tableTitle="Project Details"
        paginationPageSize={5}
        enableCheckbox={false} // Disable checkbox selection
      />
    </div>
  );
};

export default EditProject;
