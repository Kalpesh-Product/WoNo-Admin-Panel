const Project = require("../../models/tasks/Project");
const validateUsers = require("../../utils/validateUsers");

const createProject = async (req, res, next) => {
  try {
    const {
      projectName,
      description,
      dueDate,
      status,
      assignees,
      assignedDate,
      priority,
    } = req.body;
    const { user, company } = req;

    if (
      !projectName ||
      !description ||
      !assignedDate ||
      !dueDate ||
      !status ||
      !assignees
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const startDate = new Date(assignedDate);
    const endDate = new Date(dueDate);

    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ message: "Invalid start date format" });
    }
    if (isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Invalid end date format" });
    }

    const existingUsers = await validateUsers(assignees);

    if (existingUsers.length !== assignees.length) {
      return res
        .status(400)
        .json({ message: "One or more assignees are invalid or do not exist" });
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
    });

    await newProject.save();
    res.status(201).json({ message: "Project added successfully" });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const { company } = req;

    const projects = await Project.find({ company });

    return res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
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

    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    const updates = {};

    if (projectName !== undefined) updates.projectName = projectName;
    if (description !== undefined) updates.description = description;
    if (dueDate !== undefined) {
      const parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({ error: "Invalid due date format" });
      }
      updates.dueDate = parsedDueDate;
    }
    if (assignedDate !== undefined) {
      const parsedAssignedDate = new Date(assignedDate);
      if (isNaN(parsedAssignedDate.getTime())) {
        return res.status(400).json({ error: "Invalid assigned date format" });
      }
      updates.assignedDate = parsedAssignedDate;
    }
    if (status !== undefined) {
      const validStatuses = ["Upcoming", "In progress", "Pending", "Completed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      updates.status = status;
    }
    if (priority !== undefined) {
      const validPriorities = ["High", "Medium", "Low"];
      if (!validPriorities.includes(priority)) {
        return res.status(400).json({ error: "Invalid priority value" });
      }
      updates.priority = priority;
    }
    if (assignees !== undefined) {
      const existingUsers = await validateUsers(assignees);

      if (existingUsers.length !== assignees.length) {
        return res.status(400).json({
          message: "One or more assignees are invalid or do not exist",
        });
      }
      updates.assignedTo = assignees;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    await Project.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { company } = req;
    const { id } = req.params;

    const deletedProject = await Project.findByIdAndUpdate(
      { _id: id, company },
      { isDeleted: true }
    );

    if (!deletedProject) {
      return res.status(400).json({ message: "Failed to delete the project" });
    }

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};
