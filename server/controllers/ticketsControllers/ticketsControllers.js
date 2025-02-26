const Tickets = require("../../models/tickets/Tickets");
const User = require("../../models/hr/UserData");
const mongoose = require("mongoose");
const Department = require("../../models/Departments");
const {
  filterCloseTickets,
  filterAcceptTickets,
  filterSupportTickets,
  filterEscalatedTickets,
  filterAssignedTickets,
} = require("../../utils/filterTickets");
const Company = require("../../models/Company");
const { createLog } = require("../../utils/moduleLogs");
const CustomError = require("../../utils/customErrorlogs");

const raiseTicket = async (req, res, next) => {
  const logPath = "tickets/TicketLog";
  const logAction = "Raise Ticket";
  const logSourceKey = "ticket";
  const { departmentId, issueId, newIssue, description } = req.body;
  const { user, ip, company } = req;

  try {
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      throw new CustomError(
        "Invalid department ID provided",
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
        "Invalid description provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundCompany = await Company.findOne({ _id: company })
      .select("selectedDepartments")
      .lean()
      .exec();

    if (!foundCompany) {
      throw new CustomError(
        "Company not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const department = foundCompany.selectedDepartments.find(
      (dept) => dept.department.toString() === departmentId
    );
    if (!department) {
      throw new CustomError(
        "Invalid Department ID",
        logPath,
        logAction,
        logSourceKey
      );
    }

    let foundIssue;
    if (issueId) {
      if (!mongoose.Types.ObjectId.isValid(issueId)) {
        throw new CustomError(
          "Invalid issueId provided",
          logPath,
          logAction,
          logSourceKey
        );
      }
      foundIssue = department.ticketIssues.find(
        (ticketIssue) => ticketIssue._id.toString() === issueId
      );
      if (!foundIssue) {
        throw new CustomError(
          "Issue not found",
          logPath,
          logAction,
          logSourceKey
        );
      }
    }

    // Determine the ticket title based on the found issue or newIssue provided
    const ticketTitle = foundIssue ? foundIssue.title : newIssue;

    const newTicket = new Tickets({
      ticket: ticketTitle,
      description,
      raisedToDepartment: departmentId,
      raisedBy: user,
      company: company,
    });

    const savedTicket = await newTicket.save();

    // Log the successful ticket creation
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Ticket raised successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: savedTicket._id,
      changes: savedTicket,
    });

    return res.status(201).json({ message: "Ticket raised successfully" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const getTickets = async (req, res, next) => {
  try {
    const { user } = req;

    const loggedInUser = await User.findOne({ _id: user })
      .populate({ path: "role", select: "roleTitle" })
      .lean()
      .exec();

    if (!loggedInUser || !loggedInUser.departments) {
      return res.sendStatus(403);
    }

    // Fetch the company document to get selectedDepartments and ticketIssues
    const company = await Company.findOne({ _id: loggedInUser.company })
      .select("selectedDepartments")
      .lean()
      .exec();

    if (!company) {
      return res.status(400).json({ message: "Company not found" });
    }

    const userDepartments = loggedInUser.departments.map((dept) =>
      dept.toString()
    );

    let matchingTickets;

    if (loggedInUser.role.roleTitle === "Master-Admin") {
      // Master-Admin can view all pending tickets in the company
      matchingTickets = await Tickets.find({
        accepted: { $exists: false },
        raisedBy: { $ne: loggedInUser._id },
        status: "Pending",
        company: loggedInUser.company,
      }).populate([
        { path: "raisedBy", select: "name" },
        { path: "raisedToDepartment", select: "name" },
      ]);
    } else {
      // Department admins or users can view tickets in their departments
      matchingTickets = await Tickets.find({
        $or: [
          { raisedToDepartment: { $in: userDepartments } },
          { escalatedTo: { $in: userDepartments } },
        ],
        accepted: { $exists: false },
        raisedBy: { $ne: loggedInUser._id },
        company: loggedInUser.company,
        status: "Pending",
      })
        .populate([
          { path: "raisedBy", select: "name" },
          { path: "raisedToDepartment", select: "name" },
        ])
        .lean()
        .exec();
    }

    if (!matchingTickets.length) {
      return res.status(404).json({ message: "No tickets available" });
    }

    // Attach ticket issueId title from Company.selectedDepartments.ticketIssues
    const ticketsWithIssueTitle = matchingTickets.map((ticket) => {
      const department = company.selectedDepartments.find(
        (dept) =>
          dept.department.toString() === ticket.raisedToDepartment.toString()
      );

      const ticketIssue = department?.ticketIssues.find(
        (issueId) => issueId._id.toString() === ticket.ticket.toString()
      );

      return {
        ...ticket,
        ticketIssueTitle: ticketIssue ? ticketIssue.title : "Issue not found",
      };
    });

    return res.status(200).json(ticketsWithIssueTitle);
  } catch (error) {
    next(error);
  }
};

const acceptTicket = async (req, res, next) => {
  const logPath = "tickets/TicketLog";
  const logAction = "Accept Ticket";
  const logSourceKey = "ticket";
  const { user, company, ip } = req;

  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      throw new CustomError(
        "Ticket ID is required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new CustomError(
        "Invalid ticket ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();
    if (!foundUser) {
      throw new CustomError("User not found", logPath, logAction, logSourceKey);
    }

    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      throw new CustomError(
        "Ticket not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Check if the ticket's raised department is among the user's departments
    const userDepartments = foundUser.departments.map((dept) =>
      dept.toString()
    );
    const ticketInDepartment = userDepartments.some(
      (deptId) => foundTicket.raisedToDepartment.toString() === deptId
    );
    if (!ticketInDepartment) {
      throw new CustomError(
        "User does not have permission to accept this ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Update the ticket by marking it as accepted and setting status to "In Progress"
    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticketId,
      { accepted: user, status: "In Progress" },
      { new: true }
    );
    if (!updatedTicket) {
      throw new CustomError(
        "Failed to accept ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Log the successful ticket acceptance
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Ticket accepted successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedTicket._id,
      changes: { acceptedBy: user, status: "In Progress" },
    });

    return res.status(200).json({ message: "Ticket accepted successfully" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const assignTicket = async (req, res, next) => {
  const logPath = "tickets/TicketLog";
  const logAction = "Assign Ticket";
  const logSourceKey = "ticket";
  const { user, company, ip } = req;

  try {
    const { ticketId, assignee } = req.body;

    if (!ticketId || !assignee) {
      throw new CustomError(
        "Ticket ID and assignee are required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(assignee)) {
      throw new CustomError(
        "Invalid assignee ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();
    if (!foundUser) {
      throw new CustomError("User not found", logPath, logAction, logSourceKey);
    }

    const foundAssignee = await User.findOne({ _id: assignee })
      .select("-refreshToken -password")
      .lean()
      .exec();
    if (!foundAssignee) {
      throw new CustomError(
        "Assignee not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new CustomError(
        "Invalid ticket ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      throw new CustomError(
        "Ticket not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Check if the ticket's raised department is among the user's departments
    const userDepartments = foundUser.departments.map((dept) =>
      dept.toString()
    );
    const ticketInDepartment = userDepartments.some(
      (deptId) => foundTicket.raisedToDepartment.toString() === deptId
    );
    if (!ticketInDepartment) {
      throw new CustomError(
        "User does not have permission to assign this ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Update the ticket by adding the assignee and setting status to "In Progress"
    const updatedTicket = await Tickets.findOneAndUpdate(
      { _id: ticketId },
      { $addToSet: { assignees: assignee }, status: "In Progress" },
      { new: true }
    );
    if (!updatedTicket) {
      throw new CustomError(
        "Failed to assign ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Log the successful ticket assignment
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Ticket assigned successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedTicket._id,
      changes: {
        assignedTo: assignee,
        assignedBy: user,
        status: "In Progress",
      },
    });

    return res.status(200).json({ message: "Ticket assigned successfully" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const escalateTicket = async (req, res, next) => {
  const logPath = "tickets/TicketLog";
  const logAction = "Escalate Ticket";
  const logSourceKey = "ticket";
  const { user, company, ip } = req;
  const { ticketId, departmentId } = req.body;

  try {
    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();
    if (!foundUser) {
      throw new CustomError("User not found", logPath, logAction, logSourceKey);
    }

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      throw new CustomError(
        "Invalid Department ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }
    const foundDepartment = await Department.findOne({ _id: departmentId })
      .lean()
      .exec();
    if (!foundDepartment) {
      throw new CustomError(
        "Department does not exist",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new CustomError(
        "Invalid ticket ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }
    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      throw new CustomError(
        "Ticket does not exist",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Check if the current user belongs to any department relevant to the ticket
    const userDepartments = foundUser.departments.map((dept) =>
      dept.toString()
    );
    const foundTickets = await Tickets.find({
      raisedToDepartment: {
        $in: userDepartments.map((id) => new mongoose.Types.ObjectId(id)),
      },
    });
    if (!foundTickets.length) {
      throw new CustomError(
        "User does not have permission to escalate this ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Update the ticket: add the departmentId to the escalatedTo array
    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticketId,
      { $push: { escalatedTo: departmentId } },
      { new: true }
    );
    if (!updatedTicket) {
      throw new CustomError(
        "Failed to escalate ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Log the successful escalation
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Ticket escalated successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedTicket._id,
      changes: { escalatedTo: departmentId, escalatedBy: user },
    });

    return res.status(200).json({ message: "Ticket escalated successfully" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const closeTicket = async (req, res, next) => {
  const logPath = "tickets/TicketLog";
  const logAction = "Close Ticket";
  const logSourceKey = "ticket";
  const { user, company, ip } = req;

  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      throw new CustomError(
        "Ticket ID is required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new CustomError(
        "Invalid ticket ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();
    if (!foundUser) {
      throw new CustomError("User not found", logPath, logAction, logSourceKey);
    }

    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      throw new CustomError(
        "Ticket does not exist",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const userDepartments = foundUser.departments.map((dept) =>
      dept.toString()
    );
    const ticketInDepartment = userDepartments.some(
      (deptId) => foundTicket.raisedToDepartment.toString() === deptId
    );
    if (!ticketInDepartment && !foundTicket.assignees.includes(foundUser._id)) {
      throw new CustomError(
        "User does not have permission to close this ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const updatedTicket = await Tickets.findByIdAndUpdate(
      ticketId,
      { status: "Closed" },
      { new: true }
    );
    if (!updatedTicket) {
      throw new CustomError(
        "Failed to close ticket",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Log the successful ticket closure
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Ticket closed successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedTicket._id,
      changes: { closedBy: user, status: "Closed" },
    });

    return res.status(200).json({ message: "Ticket closed successfully" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const fetchFilteredTickets = async (req, res, next) => {
  try {
    const { user } = req;

    const { flag } = req.params;

    const loggedInUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .populate({ path: "role", select: "roleTitle" })
      .lean()
      .exec();
    if (!loggedInUser) {
      return res.status(400).json({ message: "No such user found" });
    }

    const userDepartments = loggedInUser.departments.map((dept) =>
      dept.toString()
    );

    if (
      !userDepartments ||
      !Array.isArray(userDepartments) ||
      userDepartments.length === 0
    ) {
      return res.status(400).json("Invalid or empty userDepartments array");
    }

    let filteredTickets = [];
    switch (flag) {
      case "accept":
        filteredTickets = await filterAcceptTickets(user, loggedInUser);
        break;
      case "assign":
        filteredTickets = await filterAssignedTickets(
          userDepartments,
          loggedInUser
        );
        break;
      case "close":
        filteredTickets = await filterCloseTickets(
          userDepartments,
          loggedInUser
        );
        break;
      case "support":
        filteredTickets = await filterSupportTickets(user, loggedInUser);
        break;
      case "escalate":
        filteredTickets = await filterEscalatedTickets(
          userDepartments,
          loggedInUser
        );
        break;
      default:
        return res.sendStatus(404);
    }

    return res.status(200).json(filteredTickets);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  raiseTicket,
  getTickets,
  acceptTicket,
  assignTicket,
  escalateTicket,
  closeTicket,
  fetchFilteredTickets,
};
