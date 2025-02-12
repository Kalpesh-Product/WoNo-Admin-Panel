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

const raiseTicket = async (req, res, next) => {
  try {
    const user = req.user;
    const { departmentId, issue, newIssue, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res
        .status(400)
        .json({ message: "Invalid department ID provided" });
    }

    if (
      typeof description !== "string" ||
      !description.length ||
      description?.replace(/\s/g, "")?.length > 100
    ) {
      return res.status(400).json({ message: "Invalid description provided" });
    }

    const loggedInUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!loggedInUser) {
      return res.sendStatus(403);
    }

    const company = await Company.findOne({ _id: loggedInUser.company })
      .select("selectedDepartments")
      .lean()
      .exec();

    if (!company) {
      return res.status(400).json({ message: "Company not found" });
    }

    // Find the department in selectedDepartments
    const department = company.selectedDepartments.find(
      (dept) => dept.department.toString() === departmentId
    );

    if (!department) {
      return res.status(400).json({ message: "Invalid Department ID" });
    }

    // Check if the issue exists in the department's ticketIssues
    let foundIssue;
    if (issue) {
      if (!mongoose.Types.ObjectId.isValid(issue)) {
        return res.status(400).json({ message: "Invalid issue provided" });
      }

      foundIssue = department.ticketIssues.find(
        (ticketIssue) => ticketIssue._id.toString() === issue
      );

      if (!foundIssue) {
        return res.status(400).json({ message: "Invalid Issue ID provided" });
      }
    }

    // Now create the ticket
    const newTicket = new Tickets({
      ticket: foundIssue ? foundIssue.title : newIssue,
      description,
      raisedToDepartment: departmentId,
      raisedBy: loggedInUser._id,
      company: loggedInUser.company,
    });

    await newTicket.save();
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

    // Attach ticket issue title from Company.selectedDepartments.ticketIssues
    const ticketsWithIssueTitle = matchingTickets.map((ticket) => {
      const department = company.selectedDepartments.find(
        (dept) =>
          dept.department.toString() === ticket.raisedToDepartment.toString()
      );

      const ticketIssue = department?.ticketIssues.find(
        (issue) => issue._id.toString() === ticket.ticket.toString()
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
    const { user } = req;
    const { ticketId } = req.body;

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let foundTicket;
    if (mongoose.Types.ObjectId.isValid(ticketId)) {
      foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();
      if (!foundTicket) {
        return res.status(400).json({ message: "Invalid ticket ID provided" });
      }
    }

    const userDepartments = foundUser.departments.map((dept) =>
      dept.toString()
    );

    const ticketInDepartment = userDepartments.some((id) =>
      foundTicket.raisedToDepartment.equals(id)
    );

    if (!ticketInDepartment) {
      return res.sendStatus(403);
    }

    await Tickets.findByIdAndUpdate(
      { _id: ticketId },
      { accepted: user, status: "In Progress" }
    );

    return res.status(200).json({ message: "Ticket accepted successfully" });
  } catch (error) {
    next(error);
  }
};

const assignTicket = async (req, res, next) => {
  try {
    const { user } = req;
    const { ticketId, assignee } = req.body;

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (mongoose.Types.ObjectId.isValid(assignee)) {
      const foundAssignee = await User.findOne({ _id: assignee })
        .select("-refreshToken -password")
        .lean()
        .exec();

      if (!foundAssignee) {
        return res
          .status(400)
          .json({ message: "Invalid Assignee ID provided" });
      }
    }
    let foundTicket;
    if (mongoose.Types.ObjectId.isValid(ticketId)) {
      foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();

      if (!foundTicket) {
        return res.status(400).json({ message: "Invalid ticket ID provided" });
      }
    }

    const userDepartments = foundUser.departments.map((dept) =>
      dept.toString()
    );

    const ticketInDepartment = userDepartments.some((id) =>
      foundTicket.raisedToDepartment.equals(id)
    );

    if (!ticketInDepartment) {
      return res.sendStatus(403);
    }

    await Tickets.findOneAndUpdate(
      { _id: ticketId },
      { $addToSet: { assignees: assignee }, status: "In Progress" }
    );

    return res.status(200).json({ message: "Ticket assigned successfully" });
  } catch (error) {
    next(error);
  }
};

const escalateTicket = async (req, res, next) => {
  try {
    const { user } = req;
    const { ticketId, departmentId } = req.body;

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res
        .status(400)
        .json({ message: "Invalid Department ID provided" });
    }

    const foundDepartment = await Department.findOne({ _id: departmentId })
      .lean()
      .exec();

    if (!foundDepartment) {
      return res.status(400).json({ message: "Department doesn't exists" });
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID provided" });
    }

    const foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();

    if (!foundTicket) {
      return res.status(400).json({ message: "Ticket doesn't exists" });
    }

    const userDepartments = foundUser.departments.map((dept) =>
      dept.toString()
    );

    const foundTickets = await Tickets.find({
      raisedToDepartment: {
        $in: userDepartments.map((id) => new mongoose.Types.ObjectId(id)),
      },
    });

    if (!foundTickets.length) {
      return res.sendStatus(403);
    }

    await Tickets.findByIdAndUpdate(
      { _id: ticketId },
      { $push: { escalatedTo: departmentId } }
    );

    return res.status(200).json({ message: "Ticket escalated successfully" });
  } catch (error) {
    next(error);
  }
};

const closeTicket = async (req, res, next) => {
  try {
    const { user } = req;
    const { ticketId } = req.body;

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    let foundTicket;
    if (mongoose.Types.ObjectId.isValid(ticketId)) {
      foundTicket = await Tickets.findOne({ _id: ticketId }).lean().exec();

      if (!foundTicket) {
        return res.status(400).json({ message: "Invalid ticket ID provided" });
      }
    }

    const userDepartments = foundUser.departments.map((dept) =>
      dept.toString()
    );

    const ticketInDepartment = userDepartments.some((id) =>
      foundTicket.raisedToDepartment.equals(id)
    );

    if (!ticketInDepartment && !foundTicket.assignees.includes(foundUser._id)) {
      return res.sendStatus(403);
    }

    await Tickets.findByIdAndUpdate({ _id: ticketId }, { status: "Closed" });

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
