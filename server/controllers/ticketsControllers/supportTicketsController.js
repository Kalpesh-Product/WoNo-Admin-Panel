const mongoose = require("mongoose");
const SupportTicket = require("../../models/tickets/supportTickets");
const User = require("../../models/UserData");
const Ticket = require("../../models/tickets/Tickets");

const supportTicket = async (req, res, next) => {
  try {
    const { user } = req;
    const { ticketId, reason } = req.body;

    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!reason || typeof reason !== "string" || reason.length > 150) {
      return res.status(400).json({ message: "Invalid Reason" });
    }

    if (mongoose.Types.ObjectId.isValid(ticketId)) {
      const foundTicket = await Ticket.findOne({ _id: ticketId })
        .lean()
        .exec();

      if (!foundTicket) {
        return res.status(400).json({ message: "Invalid ticket ID provided" });
      }
    }

    const userDepartments = foundUser.department.map((dept) =>
      dept.toString()
    );

    const foundTickets = await Ticket.find({raisedToDepartment: { $in: userDepartments }})

    if (!foundTickets) {
      return res.status(400).json({ message: "Tickets not found" });
    }

    await Ticket.findByIdAndUpdate({ _id: ticketId }, { status: "Pending" });

    const supportTicket = new SupportTicket({
      ticket: ticketId,
      user,
      reason,
    });

    await supportTicket.save();



    return res.status(201).json({ message: "Support request sent" });
  } catch (error) {
    next(error);
  }
};

module.exports = { supportTicket };
