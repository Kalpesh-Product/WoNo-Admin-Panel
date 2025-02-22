const mongoose = require("mongoose");
const SupportTicket = require("../../models/tickets/supportTickets");
const User = require("../../models/UserData");
const Ticket = require("../../models/tickets/Tickets");
const { createLog } = require("../../utils/moduleLogs");

const supportTicket = async (req, res, next) => {
  try {
    const { user, company, ip } = req;
    const { ticketId, reason } = req.body;
    let path = "tickets/TicketLogs";
    let action = "Support Ticket";

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundUser) {
      await createLog(path, action, "User not found", "Failed", user, ip, company);
      return res.status(404).json({ message: "User not found" });
    }

    if (!reason || typeof reason !== "string" || reason.length > 150) {
      await createLog(path, action, "Invalid reason provided", "Failed", user, ip, company);
      return res.status(400).json({ message: "Invalid Reason" });
    }

    let foundTicket;
    if (mongoose.Types.ObjectId.isValid(ticketId)) {
      foundTicket = await Ticket.findOne({ _id: ticketId }).lean().exec();
      if (!foundTicket) {
        await createLog(path, action, "Invalid ticket ID provided", "Failed", user, ip, company);
        return res.status(400).json({ message: "Invalid ticket ID provided" });
      }
    }

    const userDepartments = foundUser.departments.map((dept) => dept.toString());

    const foundTickets = await Ticket.find({
      raisedToDepartment: { $in: userDepartments },
    });

    if (!foundTickets.length) {
      await createLog(path, action, "No tickets found for user", "Failed", user, ip, company);
      return res.status(400).json({ message: "Tickets not found" });
    }

    await Ticket.findByIdAndUpdate({ _id: ticketId }, { status: "Pending" });

    const supportTicket = new SupportTicket({
      ticket: ticketId,
      user,
      reason,
    });

    await supportTicket.save();

    await createLog(path, action, "Support request sent successfully", "Success", user, ip, company, ticketId, { reason });

    return res.status(201).json({ message: "Support request sent" });
  } catch (error) {
    next(error);
  }
};


const getSupportedTickets = async (req, res, next) => {
  const company = req.company;

  try {
    const supportTickets = await SupportTicket.find({ company }).populate({
      path: "ticket",
      select: "_id ticket raisedToDepartment raisedBy status company",
    });

    if (supportTickets.length < 0) {
      return res.status(400).json({ message: "No Support tickets found" });
    }

    return res.status(200).json(supportTickets);
  } catch (error) {
    next(error);
  }
};

module.exports = { supportTicket, getSupportedTickets };
