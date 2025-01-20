const Tickets = require("../../models/tickets/Tickets");
const TicketIssues = require("../../models/tickets/TicketIssues");
const User = require("../../models/User");
const mongoose = require("mongoose");
const Ticket = require("../../models/tickets/Tickets");
const Department = require("../../models/Departments");

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
    const allTickets = await Ticket.find()
      .populate([
        { path: "ticket" },
        { path: "raisedBy", select: "-refreshToken -password" },
      ])
      .lean()
      .exec();

    for (let ticket of allTickets) {
      if (
        loggedInUser.department.some((dept) =>
          dept.equals(ticket.raisedToDepartment)
        )
      ) {
        const filteredTickets = allTickets.filter((tkt) =>
          loggedInUser.department.some((dept) =>
            dept.equals(tkt.raisedToDepartment)
          )
        );
        return res.status(200).json(filteredTickets);
      }
      for (let dept of loggedInUser.department) {
        console.log("something");
        if (ticket.escalatedTo.includes(dept)) {
          return res.status(200).json(allTickets);
        }
      }
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

    if (mongoose.Types.ObjectId.isValid(ticketId)) {
      const foundTicket = await Tickets.findOne({ _id: ticketId })
        .lean()
        .exec();

      if (!foundTicket) {
        return res.status(400).json({ message: "Invalid ticket ID provided" });
      }
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

    if (mongoose.Types.ObjectId.isValid(ticketId)) {
      const foundTicket = await Tickets.findOne({ _id: ticketId })
        .lean()
        .exec();

      if (!foundTicket) {
        return res.status(400).json({ message: "Invalid ticket ID provided" });
      }
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

    if (mongoose.Types.ObjectId.isValid(ticketId)) {
      const foundTicket = await Tickets.findOne({ _id: ticketId })
        .lean()
        .exec();

      if (!foundTicket) {
        return res.status(400).json({ message: "Invalid ticket ID provided" });
      }
    }

    await Tickets.findByIdAndUpdate({ _id: ticketId }, { status: "Closed" });

    return res.status(200).json({ message: "Ticket closed successfully" });
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
};
