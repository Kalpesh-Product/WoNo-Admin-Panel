const Task = require("../../models/tasks/Task");
const validateUsers = require("../../utils/validateUsers");

const createTasks = async (req, res, next) => {
  try {
    const {
      taskName,
      description,
      projectId,
      status,
      priority,
      assignees,
      dueDate,
      dueTime,
      taskType,
    } = req.body;
    const { user, company } = req;

    if (
      !taskName ||
      !description ||
      !projectId ||
      !status ||
      !priority ||
      !assignees ||
      !dueDate
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const assignedDate = new Date();
    const parsedDueDate = new Date(dueDate);
    const parsedDueTime = new Date(dueTime);

    if (isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    if (dueTime && isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (
      typeof description !== "string" ||
      !description.length ||
      description?.replace(/\s/g, "")?.length > 100
    ) {
      return res.status(400).json({ message: "Character limit exceeded" });
    }

    const existingUsers = await validateUsers(assignees);

    if (existingUsers.length !== assignees.length) {
      return res
        .status(400)
        .json({ message: "One or more assignees are invalid or do not exist" });
    }

    const newTask = new Task({
      taskName,
      description,
      project: projectId,
      status,
      priority,
      assignedTo: assignees,
      assignedBy: user,
      assignedDate,
      dueDate: parsedDueDate,
      dueTime: dueTime ? parsedDueTime : null,
      taskType,
      company,
    });

    await newTask.save();
    res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { taskName, description, status, priority, assignees, taskType } =
      req.body;

    const updates = {};

    if (taskName !== undefined) updates.taskName = taskName;
    if (taskType !== undefined) updates.taskType = taskType;
    if (description !== undefined) updates.description = description;
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
      if (!Array.isArray(assignees)) {
        return res
          .status(400)
          .json({ error: "Assignees must be an array of user IDs" });
      }
      updates.assignedTo = assignees;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { company } = req;

    const projects = await Task.find({ company }).populate({
      path: "project",
      select: "projectName",
    });

    return res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const getTodayTasks = async (req, res, next) => {
  try {
    const { user, company } = req;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      company,
      assignedTo: { $in: [user] },
      assignedDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!tasks) {
      return res.status(400).json({ message: "Failed to fetch the tasks" });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { company } = req;
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndUpdate(
      { _id: id, company },
      { isDeleted: true }
    );

    if (!deletedTask) {
      return res.status(400).json({ message: "Failed to delete the task" });
    }

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTasks,
  updateTask,
  getTasks,
  getTodayTasks,
  deleteTask,
};
