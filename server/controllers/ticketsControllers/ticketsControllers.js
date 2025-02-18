const Tickets = require("../../models/tickets/Tickets");
const User = require("../../models/UserData");
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

const raiseTicket = async (req, res, next) => {
  try {

    const { departmentId, issueId, newIssue, description } = req.body;
    const company = req.company;
    const user = req.user;
    const ip = req.ip;
    let path = "tickets/TicketLogs";
    let action = "Raise Ticket";

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      await createLog(path, action, "Invalid department ID provided", "Failed", user, ip, company);

      return res
        .status(400)
        .json({ message: "Invalid department ID provided" });
    }

    if (
      typeof description !== "string" ||
      !description.length ||
      description?.replace(/\s/g, "")?.length > 100
    ) {
      await createLog(path, action, "Invalid description provided", "Failed", user, ip, company);

      return res.status(400).json({ message: "Invalid description provided" });
    }

    const foundcompany = await Company.findOne({ _id: company })
      .select("selectedDepartments")
      .lean()
      .exec();

    if (!foundcompany) {
      await createLog(path, action, "Company not found", "Failed", user, ip, company);

      return res.status(400).json({ message: "Company not found" });
    }

    // Find the department in selectedDepartments
    const department = foundcompany.selectedDepartments.find(
      (dept) => dept.department.toString() === departmentId
    );

    if (!department) {
      await createLog(path, action, "Invalid Department ID", "Failed", user, ip, company);

      return res.status(400).json({ message: "Invalid Department ID" });
    }

    // Check if the issueId exists in the department's ticketIssues
    let foundIssue;
    if (issueId) {
      if (!mongoose.Types.ObjectId.isValid(issueId)) {
        await createLog(path, action, "Invalid issueId provided", "Failed", user, ip, company);

        return res.status(400).json({ message: "Invalid issueId provided" });
      }

      foundIssue = department.ticketIssues.find(
        (ticketIssue) => ticketIssue._id.toString() === issueId
      );

      if (!foundIssue) {
        await createLog(path, action, "Issue not found", "Failed", user, ip, company);

        return res.status(404).json({ message: "Issue not found" });
      }
    }

    // Now create the ticket
    const newTicket = new Tickets({
      ticket: foundIssue ? foundIssue.title : newIssue,
      description,
      raisedToDepartment: departmentId,
      raisedBy: user,
      company: company,
    });

    const savedTicket = await newTicket.save();

    const data = { ...savedTicket._doc };

    await createLog(path, action,"Ticket raised successfully","Success",user, ip, company,savedTicket._id,data);

    return res.status(201).json({ message: "Ticket raised successfully" });
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    const { user } = req;

    // Fetch logged-in user details
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
  try {
    const { ticketId } = req.body;
    const company = req.company;
    const user = req.user;
    const ip = req.ip;
    let path = "tickets/TicketLogs";
    let action = "Accept Ticket";

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundUser) {
      await createLog(path, action, "User not found", "Failed", user, ip, company);
      return res.status(404).json({ message: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      await createLog(path, action, "Invalid ticket ID provided", "Failed", user, ip, company);
      return res.status(400).json({ message: "Invalid ticket ID provided" });
    }

    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      await createLog(path, action, "Ticket not found", "Failed", user, ip, company);
      return res.status(404).json({ message: "Ticket not found" });
    }

    const userDepartments = foundUser.departments.map((dept) => dept.toString());

    const ticketInDepartment = userDepartments.some((id) =>
      foundTicket.raisedToDepartment.equals(id)
    );

    if (!ticketInDepartment) {
      await createLog(path, action, "User does not have permission to accept this ticket", "Failed", user, ip, company);
      return res.sendStatus(403);
    }

    const updatedTicket = await Tickets.findByIdAndUpdate(
      { _id: ticketId },
      { accepted: user, status: "In Progress" },
      { new: true } // Return the updated ticket
    );

    await createLog(path, action, "Ticket accepted successfully", "Success", user, ip, company, updatedTicket._id, {
      acceptedBy: user,
      status: "In Progress",
    });

    return res.status(200).json({ message: "Ticket accepted successfully" });
  } catch (error) {
    next(error);
  }
};


const assignTicket = async (req, res, next) => {
  try {
    const { user, company, ip } = req;
    const { ticketId, assignee } = req.body;
    let path = "tickets/TicketLogs";
    let action = "Assign Ticket";

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundUser) {
      await createLog(path, action, "User not found", "Failed", user, ip, company);
      return res.status(400).json({ message: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(assignee)) {
      await createLog(path, action, "Invalid assignee ID provided", "Failed", user, ip, company);
      return res.status(400).json({ message: "Invalid assignee ID provided" });
    }

    const foundAssignee = await User.findOne({ _id: assignee })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundAssignee) {
      await createLog(path, action, "Assignee not found", "Failed", user, ip, company);
      return res.status(400).json({ message: "Assignee not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      await createLog(path, action, "Invalid ticket ID provided", "Failed", user, ip, company);
      return res.status(400).json({ message: "Invalid ticket ID provided" });
    }

    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      await createLog(path, action, "Ticket not found", "Failed", user, ip, company);
      return res.status(400).json({ message: "Ticket not found" });
    }

    const userDepartments = foundUser.departments.map((dept) => dept.toString());

    const ticketInDepartment = userDepartments.some((id) =>
      foundTicket.raisedToDepartment.equals(id)
    );

    if (!ticketInDepartment) {
      await createLog(path, action, "User does not have permission to assign this ticket", "Failed", user, ip, company);
      return res.sendStatus(403);
    }

    const updatedTicket = await Tickets.findOneAndUpdate(
      { _id: ticketId },
      { $addToSet: { assignees: assignee }, status: "In Progress" },
      { new: true } // Return updated document
    );

    await createLog(path, action, "Ticket assigned successfully", "Success", user, ip, company, updatedTicket._id, {
      assignedTo: assignee,
      assignedBy: user,
      status: "In Progress",
    });

    return res.status(200).json({ message: "Ticket assigned successfully" });
  } catch (error) {
    next(error);
  }
};


const escalateTicket = async (req, res, next) => {
  try {
    const { user, company, ip } = req;
    const { ticketId, departmentId } = req.body;
    let path = "tickets/TicketLogs";
    let action = "Escalate Ticket";

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundUser) {
      await createLog(path, action, "User not found", "Failed", user, ip, company);
      return res.status(400).json({ message: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      await createLog(path, action, "Invalid Department ID provided", "Failed", user, ip, company);
      return res.status(400).json({ message: "Invalid Department ID provided" });
    }

    const foundDepartment = await Department.findOne({ _id: departmentId }).lean().exec();
    if (!foundDepartment) {
      await createLog(path, action, "Department does not exist", "Failed", user, ip, company);
      return res.status(400).json({ message: "Department does not exist" });
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      await createLog(path, action, "Invalid ticket ID provided", "Failed", user, ip, company);
      return res.status(400).json({ message: "Invalid ticket ID provided" });
    }

    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
    if (!foundTicket) {
      await createLog(path, action, "Ticket does not exist", "Failed", user, ip, company);
      return res.status(400).json({ message: "Ticket does not exist" });
    }

    const userDepartments = foundUser.departments.map((dept) => dept.toString());

    const foundTickets = await Tickets.find({
      raisedToDepartment: {
        $in: userDepartments.map((id) => new mongoose.Types.ObjectId(id)),
      },
    });

    if (!foundTickets.length) {
      await createLog(path, action, "User does not have permission to escalate this ticket", "Failed", user, ip, company);
      return res.sendStatus(403);
    }

    const updatedTicket = await Tickets.findByIdAndUpdate(
      { _id: ticketId },
      { $push: { escalatedTo: departmentId } },
      { new: true } // Return updated document
    );

    await createLog(path, action, "Ticket escalated successfully", "Success", user, ip, company, updatedTicket._id, {
      escalatedTo: departmentId,
      escalatedBy: user,
    });

    return res.status(200).json({ message: "Ticket escalated successfully" });
  } catch (error) {
    next(error);
  }
};


const closeTicket = async (req, res, next) => {
  try {
    const { user, company, ip } = req;
    const { ticketId } = req.body;
    let path = "tickets/TicketLogs";
    let action = "Close Ticket";

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundUser) {
      await createLog(path, action, "User not found", "Failed", user, ip, company);
      return res.status(400).json({ message: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      await createLog(path, action, "Invalid ticket ID provided", "Failed", user, ip, company);
      return res.status(400).json({ message: "Invalid ticket ID provided" });
    }

    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();

    if (!foundTicket) {
      await createLog(path, action, "Ticket does not exist", "Failed", user, ip, company);
      return res.status(400).json({ message: "Ticket does not exist" });
    }

    const userDepartments = foundUser.departments.map((dept) => dept.toString());

    const ticketInDepartment = userDepartments.some((id) =>
      foundTicket.raisedToDepartment.equals(id)
    );

    if (!ticketInDepartment && !foundTicket.assignees.includes(foundUser._id)) {
      await createLog(path, action, "User does not have permission to close this ticket", "Failed", user, ip, company);

      return res.sendStatus(403);
    }

    const updatedTicket = await Tickets.findByIdAndUpdate(
      { _id: ticketId },
      { status: "Closed" },
      { new: true } // Return updated document
    );

    await createLog(path, action, "Ticket closed successfully", "Success", user, ip, company, updatedTicket._id, {
      closedBy: user,
      status: "Closed"
    });

    return res.status(200).json({ message: "Ticket closed successfully" });
  } catch (error) {
    next(error);
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
