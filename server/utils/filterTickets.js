const SupportTicket = require("../models/tickets/supportTickets");
const Ticket = require("../models/tickets/Tickets");
const Company = require("../models/hr/Company");

async function filterCloseTickets(userDepartments, loggedInUser) {
  if (loggedInUser.role.roleTitle === "Master-Admin") {
    const tickets = await Ticket.find({
      status: "Closed",
      raisedBy: { $ne: loggedInUser._id },
    })
      .select("raisedBy raisedToDepartment status ticket description")
      .populate([
        { path: "raisedBy", select: "firstName lastName" },
        { path: "raisedToDepartment", select: "name" },
      ])
      .lean()
      .exec();

    return tickets;
  }

  const closedTickets = await Ticket.find({
    $and: [
      { status: "Closed" },
      { raisedToDepartment: { $in: userDepartments } },
    ],
  })
    .select("raisedBy raisedToDepartment status ticket description")
    .populate([
      { path: "raisedBy", select: "firstName lastName" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();

  return closedTickets;
}

async function filterAcceptTickets(userId, loggedInUser) {
  if (loggedInUser.role.roleTitle === "Master-Admin") {
    const tickets = await Ticket.find({
      $and: [
        { status: "In Progress" },
        { raisedBy: { $ne: loggedInUser._id } },
      ],
    })
      .select("raisedBy raisedToDepartment status ticket description")
      .populate([
        { path: "raisedBy", select: "firstName lastName" },
        { path: "raisedToDepartment", select: "name" },
      ])
      .lean()
      .exec();

    return tickets;
  }

  const acceptedTickets = await Ticket.find({
    acceptedBy: userId,
    status: "In Progress",
  })
    .select("raisedBy raisedToDepartment status ticket description")
    .populate([
      { path: "raisedBy", select: "firstName lastName" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();

  return acceptedTickets;
}

async function filterAssignedTickets(userDepartments, loggedInUser) {
  if (loggedInUser.role.roleTitle === "Master-Admin") {
    const tickets = await Ticket.find({
      assignees: { $exists: true, $ne: [] },
    })
      .select("raisedBy raisedToDepartment status ticket description")
      .populate([
        { path: "raisedBy", select: "firstName lastName" },
        { path: "raisedToDepartment", select: "name" },
      ])
      .lean()
      .exec();

    return tickets;
  }

  const assignedTickets = await Ticket.find({
    $and: [
      { assignees: { $exists: true, $ne: [] } },
      { raisedToDepartment: { $in: userDepartments } },
    ],
  })
    .select("raisedBy raisedToDepartment status ticket description")
    .populate([
      { path: "raisedBy", select: "firstName lastName" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();

  return assignedTickets;
}

async function filterSupportTickets(userId, loggedInUser) {
  if (loggedInUser.role.roleTitle === "Master-Admin") {
    const tickets = await SupportTicket.find()
      .populate([
        {
          path: "ticket",
          populate: [
            {
              path: "raisedBy",
              select: "firstName lastName",
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

    return tickets;
  }

  const supportTickets = await SupportTicket.find({
    user: userId,
  })
    .populate([
      {
        path: "ticket",
        populate: [
          {
            path: "raisedBy",
            select: "firstName lastName",
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

async function filterEscalatedTickets(userDepartments, loggedInUser) {
  if (loggedInUser.role.roleTitle === "Master-Admin") {
    const tickets = await Ticket.find({
      escalatedTo: { $exists: true, $ne: [] },
    })
      .select("raisedBy raisedToDepartment status ticket description")
      .populate([
        { path: "raisedBy", select: "firstName lastName" },
        { path: "raisedToDepartment", select: "name" },
      ])
      .lean()
      .exec();

    return tickets;
  }

  const escalatedTickets = await Ticket.find({
    escalatedTo: { $in: userDepartments },
  })
    .select("raisedBy raisedToDepartment status ticket description")
    .populate([
      { path: "raisedBy", select: "firstName lastName" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();

  return escalatedTickets;
}

async function filterMyTickets(loggedInUser) {
  const myTickets = await Ticket.find({ raisedBy: loggedInUser._id })
    .select("raisedBy raisedToDepartment status ticket description")
    .populate([
      { path: "raisedBy", select: "firstName lastName" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();
  return myTickets;
}

async function filterTodayTickets(loggedInUser, company) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Fetch today's tickets for the logged-in user
  const todayTickets = await Ticket.find({
    raisedBy: loggedInUser._id,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  })
    .select("raisedBy raisedToDepartment status ticket description")
    .populate([
      { path: "raisedBy", select: "firstName lastName" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();

  // Fetch the company's selected departments with ticket issues
  const foundCompany = await Company.findOne({ _id: company })
    .select("selectedDepartments")
    .lean()
    .exec();

  if (!foundCompany) {
    throw new Error("Company not found");
  }

  // Extract the ticket priority from the company's selected departments
  const updatedTickets = todayTickets.map((ticket) => {
    const department = foundCompany.selectedDepartments.find(
      (dept) =>
        dept.department.toString() === ticket.raisedToDepartment?._id.toString()
    );

    let priority = "Low"; // Default priority

    if (department) {
      const issue = department.ticketIssues.find(
        (issue) => issue.title === ticket.ticket
      );

      priority = issue?.priority || "Low";
    }

    // If the issue is not found, check for "Other" and assign its priority
    if (!priority || priority === "Low") {
      const otherIssue = foundCompany.selectedDepartments
        .flatMap((dept) => dept.ticketIssues)
        .find((issue) => issue.title === "Other");

      priority = otherIssue?.priority || "Low";
    }

    return {
      ...ticket,
      priority,
    };
  });

  return updatedTickets;
}

module.exports = {
  filterCloseTickets,
  filterAcceptTickets,
  filterSupportTickets,
  filterEscalatedTickets,
  filterAssignedTickets,
  filterMyTickets,
  filterTodayTickets,
};
