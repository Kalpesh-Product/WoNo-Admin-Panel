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
      typeof description !== "string" ||
      !description.length ||
      description?.replace(/\s/g, "")?.length > 100
    ) {
      return res.status(400).json({ message: "Invalid description provided" });
    }
    let foundIssue;
    if (mongoose.Types.ObjectId.isValid(issue)) {
      foundIssue = await TicketIssues.findOne({ _id: issue }).lean().exec();
      if (!foundIssue) {
        return res.status(400).json({ message: "Invalid Issue ID provided" });
      }
    }
    const foundUser = await User.findOne({ _id: user })
      .select("-refreshToken -password")
      .lean()
      .exec();
    const newTicket = new Tickets({
      ticketTitle: foundIssue ? foundIssue?.title : issue,
    });
  } catch (error) {
    next(error);
  }
};

const assignATicket = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
