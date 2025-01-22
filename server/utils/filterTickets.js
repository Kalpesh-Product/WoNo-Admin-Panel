const {
  supportTicket,
} = require("../controllers/ticketsControllers/supportTicketsController");
const SupportTicket = require("../models/tickets/supportTickets");
const Ticket = require("../models/tickets/Tickets");
const Tickets = require("../models/tickets/Tickets");

async function filterCloseTickets(userDepartments) {
  const closedTickets = await Tickets.find({
    $and: [
      { status: "Closed" },
      { raisedToDepartment: { $in: userDepartments } },
    ],
  })
    .populate([
      { path: "ticket" },
      { path: "raisedBy", select: "name" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();

  return closedTickets;
}

async function filterAcceptTickets(userId) {
  const acceptedTickets = await Ticket.find({
    accepted: mongoose.Types.ObjectId(userId),
    status: "In Progress",
  })
    .populate([
      { path: "ticket" },
      { path: "raisedBy", select: "name" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();
  console.log(acceptedTickets);

  return acceptedTickets;
}

async function filterAssignedTickets() {
  const assignedTickets = await Tickets.find({
    $and: [
      { assignees: { $exists: true } },
      { $expr: { $gt: [{ $size: "$assignees" }, 0] } },
      { raisedToDepartment: { $in: userDepartments } },
    ],
  })
    .populate([
      { path: "ticket" },
      { path: "raisedBy", select: "name" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();

  return assignedTickets;
}

async function filterSupportTickets(userId) {
  const supportTickets = await SupportTicket.find({
    user: userId,
  })
    .populate([
      {
        path: "ticket",
        populate: [
          {
            path: "raisedBy",
            select: "name",
          },
          {
            path: "raisedToDepartment",
            select: "name",
          },
        ],
      },
    ])
    .lean()
    .exec();

  return supportTickets;
}

async function filterEscalatedTickets(userDepartments) {
  const escalatedTickets = await Ticket.find({
    escalatedTo: { $in: userDepartments },
  })
    .populate([
      { path: "ticket" },
      { path: "raisedBy", select: "name" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();

  return escalatedTickets;
}

module.exports = {
  filterCloseTickets,
  filterAcceptTickets,
  filterSupportTickets,
  filterEscalatedTickets,
  filterAssignedTickets,
};
