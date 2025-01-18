const mongoose = require("mongoose");
const SupportTicket = require("../../models/tickets/supportTickets");
const User = require("../../models/User");

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
      const foundTicket = await Tickets.findOne({ _id: ticketId })
        .lean()
        .exec();

      if (!foundTicket) {
        return res.status(400).json({ message: "Invalid ticket ID provided" });
      }
    }

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
