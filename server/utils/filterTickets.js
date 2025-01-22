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
  const acceptedTickets = await Tickets.find({
    accepted: userId,
    status: "In Progress",
  })
    .populate([
      { path: "ticket" },
      { path: "raisedBy", select: "name" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();

  return acceptedTickets;
}

module.exports = { filterCloseTickets, filterAcceptTickets };
