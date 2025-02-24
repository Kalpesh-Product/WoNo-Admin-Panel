const Department = require("../../models/Departments");
const Project = require("../../models/tasks/Project");
const CustomError = require("../../utils/customErrorlogs");
const { formatDate } = require("../../utils/formatDateTime");
const { createLog } = require("../../utils/moduleLogs");
const validateUsers = require("../../utils/validateUsers");

const createProject = async (req, res, next) => {
  const { user, ip, company } = req;
  const logPath = "tasks/TaskLogs";
  const logAction = "Create Project";
  const logSourceKey = "project";

  try {
    const {
      projectName,
      description,
      dueDate,
      status,
      assignees,
      assignedDate,
      priority,
      department,
    } = req.body;

    if (
      !projectName ||
      !description ||
      !assignedDate ||
      !dueDate ||
      !status ||
      !assignees ||
      !department
    ) {
      throw new CustomError(
        "Missing required fields",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const startDate = new Date(assignedDate);
    const endDate = new Date(dueDate);

    if (!mongoose.Types.ObjectId.isValid(department)) {
      throw new CustomError(
        "Invalid department ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const departmentExists = await Department.findById({ _id: department });

    if (!departmentExists) {
      throw new CustomError(
        "Department provided doesn't exists",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (isNaN(startDate.getTime())) {
      throw new CustomError(
        "Invalid start date format",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (isNaN(endDate.getTime())) {
      throw new CustomError(
        "Invalid end date format",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const existingUsers = await validateUsers(assignees);
    if (existingUsers.length !== assignees.length) {
      throw new CustomError(
        "One or more assignees are invalid or do not exist",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const newProject = new Project({
      projectName,
      description,
      assignedDate: startDate,
      dueDate: endDate,
      assignedTo: assignees,
      assignedBy: user,
      status,
      priority,
      company,
      department,
    });

    await newProject.save();

    // Log success with createLog
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Project added successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: newProject._id,
      changes: {
        projectName,
        description,
        assignedDate: startDate,
        dueDate: endDate,
        status,
        priority,
        assignees,
      },
    });

    return res.status(201).json({ message: "Project added successfully" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const getProjects = async (req, res, next) => {
  try {
    const { company } = req;

    const projects = await Project.find({ company })
      .populate("department", "name")
      .populate("assignedBy", "firstName lastName")
      .populate("assignedTo", "firstName lastName")
      .lean();

    const transformedProjects = projects.map((project) => {
      return {
        ...project,
        dueDate: formatDate(project.dueDate),
        assignedDate: formatDate(project.assignedDate),
      };
    });

    return res.status(200).json(transformedProjects);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  const { user, ip, company } = req;
  const logPath = "tasks/TaskLogs";
  const logAction = "Update Project";
  const logSourceKey = "project";

  try {
    const { id } = req.params;
    const {
      projectName,
      description,
      dueDate,
      status,
      assignees,
      assignedDate,
      priority,
    } = req.body;

    if (!id) {
      throw new CustomError(
        "Project ID must be provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      throw new CustomError(
        "Project not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const updates = {};

    if (projectName !== undefined) updates.projectName = projectName;
    if (description !== undefined) updates.description = description;
    if (dueDate !== undefined) {
      const parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        throw new CustomError(
          "Invalid due date format",
          logPath,
          logAction,
          logSourceKey
        );
      }
      updates.dueDate = parsedDueDate;
    }
    if (assignedDate !== undefined) {
      const parsedAssignedDate = new Date(assignedDate);
      if (isNaN(parsedAssignedDate.getTime())) {
        throw new CustomError(
          "Invalid assigned date format",
          logPath,
          logAction,
          logSourceKey
        );
      }
      updates.assignedDate = parsedAssignedDate;
    }
    if (status !== undefined) {
      const validStatuses = ["Upcoming", "In progress", "Pending", "Completed"];
      if (!validStatuses.includes(status)) {
        throw new CustomError(
          "Invalid status value",
          logPath,
          logAction,
          logSourceKey
        );
      }
      updates.status = status;
    }
    if (priority !== undefined) {
      const validPriorities = ["High", "Medium", "Low"];
      if (!validPriorities.includes(priority)) {
        throw new CustomError(
          "Invalid priority value",
          logPath,
          logAction,
          logSourceKey
        );
      }
      updates.priority = priority;
    }
    if (assignees !== undefined) {
      const existingUsers = await validateUsers(assignees);
      if (existingUsers.length !== assignees.length) {
        throw new CustomError(
          "One or more assignees are invalid or do not exist",
          logPath,
          logAction,
          logSourceKey
        );
      }
      updates.assignedTo = assignees;
    }

    if (Object.keys(updates).length === 0) {
      throw new CustomError(
        "No valid fields to update",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      throw new CustomError(
        "Failed to update project",
        logPath,
        logAction,
        logSourceKey
      );
    }

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Project updated successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedProject._id,
      changes: updates,
    });

    return res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const deleteProject = async (req, res, next) => {
  const { company, user, ip } = req;
  const logPath = "tasks/TaskLogs";
  const logAction = "Delete Project";
  const logSourceKey = "project";

  try {
    const { id } = req.params;
    if (!id) {
      throw new CustomError(
        "Project ID must be provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const deletedProject = await Project.findByIdAndUpdate(
      { _id: id, company },
      { isDeleted: true },
      { new: true }
    );

    if (!deletedProject) {
      throw new CustomError(
        "Failed to delete the project",
        logPath,
        logAction,
        logSourceKey
      );
    }

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Project deleted successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: deletedProject._id,
      changes: { isDeleted: true },
    });

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};
