const Tickets = require("../../models/tickets/Tickets");
const TicketIssues = require("../../models/tickets/TicketIssues");
const User = require("../../models/User");
const mongoose = require("mongoose");
const Ticket = require("../../models/tickets/Tickets");
const Department = require("../../models/Departments");
const {
  filterCloseTickets,
  filterAcceptTickets,
} = require("../../utils/filterTickets");

const raiseTicket = async (req, res, next) => {
  try {
    const user = req.user;
    const { departmentId, issue, description } = req.body;
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

    if (!mongoose.Types.ObjectId.isValid(issue)) {
      return res.status(400).json({ message: "Invalid issue provided" });
    }

    const foundIssue = await TicketIssues.findOne({ _id: issue }).lean().exec();
    if (!foundIssue) {
      return res.status(400).json({ message: "Invalid Issue ID provided" });
    }

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const newTicket = new Ticket({
      ticket: foundIssue?._id,
      description,
      raisedToDepartment: departmentId,
      raisedBy: foundUser?._id,
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
    const loggedInUser = await User.findOne({ _id: user }).lean().exec();

    if (!loggedInUser || !loggedInUser.department) {
      return res.sendStatus(403);
    }

    const userDepartments = loggedInUser.department.map((dept) =>
      dept.toString()
    );

    const matchingTickets = await Ticket.find({
      $and: [
        {
          $or: [
            { raisedToDepartment: { $in: userDepartments } },
            { escalatedTo: { $in: userDepartments } },
          ],
        },
        { "ticket.accepted": { $exists: false } },
        { raisedBy: { $ne: loggedInUser._id } },
      ],
    })
      .populate([
        { path: "ticket" },
        { path: "raisedBy", select: "name" },
        { path: "raisedToDepartment", select: "name" },
      ])
      .lean()
      .exec();

    if (matchingTickets.length) {
      return res.status(200).json(matchingTickets);
    }

    if (!matchingTickets.length) {
      return res.status(404).json({ message: "No tickets aviliable" });
    }
    return res.sendStatus(403);
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

    const userDepartments = foundUser.department.map((dept) => dept.toString());

    const ticketInDepartment = userDepartments.some((id) =>
      foundTicket.raisedToDepartment.equals(id)
    );

    if (!ticketInDepartment) {
      return res.status(403);
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

    const userDepartments = foundUser.department.map((dept) => dept.toString());

    const ticketInDepartment = userDepartments.some((id) =>
      foundTicket.raisedToDepartment.equals(id)
    );

    if (!ticketInDepartment) {
      return res.sendStatus(403);
    }

    await Tickets.findByIdAndUpdate(
      { _id: ticketId },
      { $push: { assignees: assignee }, status: "In Progress" }
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

    const userDepartments = foundUser.department.map((dept) => dept.toString());

    const foundTickets = await Ticket.find({
      raisedToDepartment: {
        $in: userDepartments.map((id) => new mongoose.Types.ObjectId(id)),
      },
    });

    if (!foundTickets.length) {
      return res.status(403);
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

    // this is important code do not remove it 👽
    // const userDepartments = foundUser.department.map((dept) => dept.toString());

    // const foundTickets = await Ticket.find({
    //   raisedToDepartment: { $in: userDepartments.map(id => new mongoose.Types.ObjectId(id))  },
    // });

    // if (!foundTickets.length) {
    //   return res.sendStatus(403);
    // }

    const userDepartments = foundUser.department.map((dept) => dept);

    const ticketInDepartment = userDepartments.some((id) =>
      foundTicket.raisedToDepartment.equals(id)
    );

    if (!ticketInDepartment) {
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
      .lean()
      .exec();
    if (!loggedInUser) {
      return res.status(400).json({ message: "No such user found" });
    }

    const userDepartments = loggedInUser.department.map((dept) =>
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
    if (flag === "accept") {
      filteredTickets = await filterAcceptTickets(user);
    } else if (flag === "close") {
      filteredTickets = await filterCloseTickets(userDepartments);
    }

    if (filteredTickets.length === 0) {
      return res.status(404).json({ message: "Tickets not found" });
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
