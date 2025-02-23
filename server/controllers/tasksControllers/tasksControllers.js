const Task = require("../../models/tasks/Task");
const CustomError = require("../../utils/customErrorlogs");
const { createLog } = require("../../utils/moduleLogs");
const validateUsers = require("../../utils/validateUsers");

const createTasks = async (req, res, next) => {
  const { user, ip, company } = req;
  const logPath = "tasks/TaskLog";
  const logAction = "Create Task";
  const logSourceKey = "task";

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

    if (
      !taskName ||
      !description ||
      !projectId ||
      !status ||
      !priority ||
      !assignees ||
      !dueDate
    ) {
      throw new CustomError(
        "Missing required fields",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const assignedDate = new Date();
    const parsedDueDate = new Date(dueDate);
    const parsedDueTime = new Date(dueTime);

    if (isNaN(parsedDueDate.getTime())) {
      throw new CustomError(
        "Invalid date format",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (dueTime && isNaN(parsedDueTime.getTime())) {
      throw new CustomError(
        "Invalid date format",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (
      typeof description !== "string" ||
      !description.length ||
      description.replace(/\s/g, "").length > 100
    ) {
      throw new CustomError(
        "Character limit exceeded",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Validate all assignees
    const existingUsers = await validateUsers(assignees);
    if (existingUsers.length !== assignees.length) {
      throw new CustomError(
        "One or more assignees are invalid or do not exist",
        logPath,
        logAction,
        logSourceKey
      );
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

    // Log success with createLog
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Task added successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: newTask._id,
      changes: {
        taskName,
        description,
        projectId,
        status,
        priority,
        assignees,
        dueDate,
        dueTime,
        taskType,
      },
    });

    return res.status(201).json({ message: "Task added successfully" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const updateTask = async (req, res, next) => {
  const { user, ip, company } = req;
  const logPath = "tasks/TaskLog";
  const logAction = "Update Task";
  const logSourceKey = "task";

  try {
    const { id } = req.params;
    const { taskName, description, status, priority, assignees, taskType } =
      req.body;

    if (!id) {
      throw new CustomError(
        "Task ID must be provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const updates = {};

    if (taskName !== undefined) updates.taskName = taskName;
    if (taskType !== undefined) updates.taskType = taskType;
    if (description !== undefined) updates.description = description;
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
      if (!Array.isArray(assignees)) {
        throw new CustomError(
          "Assignees must be an array of user IDs",
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

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      throw new CustomError("Task not found", logPath, logAction, logSourceKey);
    }

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Task updated successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedTask._id,
      changes: updates,
    });

    return res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
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
  const { company, user, ip } = req;
  const logPath = "tasks/TaskLog";
  const logAction = "Delete Task";
  const logSourceKey = "task";

  try {
    const { id } = req.params;
    if (!id) {
      throw new CustomError(
        "Task ID must be provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const deletedTask = await Task.findByIdAndUpdate(
      { _id: id, company },
      { isDeleted: true },
      { new: true }
    );

    if (!deletedTask) {
      throw new CustomError(
        "Failed to delete the task",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Log the successful deletion
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Task deleted successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: deletedTask._id,
      changes: { isDeleted: true },
    });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

module.exports = {
  createTasks,
  updateTask,
  getTasks,
  getTodayTasks,
  deleteTask,
};
