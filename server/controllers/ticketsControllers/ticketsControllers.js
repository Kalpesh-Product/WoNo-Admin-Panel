const Tickets = require("../../models/tickets/Tickets");
const TicketIssues = require("../../models/tickets/TicketIssues");
const User = require("../../models/User");
const { default: mongoose } = require("mongoose");

const raiseATicket = async (req, res, next) => {
  try {
    const { user } = req;
    const { departmentId, issue, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res
        .status(400)
        .json({ message: "Invalid deaprtment ID provided" });
    }
    if (
      typeof description !== "string" &&
      description.length &&
      description?.replace(/\s/g, "")?.length > 100
    ) {
      return res.status(400).json({ message: "Invalid description provided" });
    }
    if (mongoose.Types.ObjectId.isValid(issue)) {
      const foundIssue = await TicketIssues.findOne({ _id: issue })
        .lean()
        .exec();
      if (!foundIssue) {
        return res.status(400).json({ message: "Invalid Issue ID provided" });
      }
    }
  } catch (error) {
    next(error);
  }
};
