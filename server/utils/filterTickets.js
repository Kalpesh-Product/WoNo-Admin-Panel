const mongoose = require("mongoose");
const SupportTicket = require("../models/tickets/supportTickets");
const Ticket = require("../models/tickets/Tickets");

function generateQuery(queryMapping, roles) {
  const roleHierarchy = ["Master-Admin", "Super-Admin", "Admin", "Employee"]; // For users with multiple roles, use query of higher entity

  const role = ["Master-Admin"];
  const matchedRole =
    roleHierarchy.find((roleTitle) =>
      role.some(
        (userRole) => userRole === roleTitle || userRole.endsWith(roleTitle)
      )
    ) || "None";

  return queryMapping[matchedRole] || {};
}

async function fetchTickets(query) {
  try {
    const tickets = await Ticket.find(query)
      .populate([
        { path: "raisedBy", select: "firstName lastName" },
        { path: "raisedToDepartment", select: "name" },
        { path: "escalatedTo", select: "name" },
      ])
      .lean()
      .exec();

    return tickets;
  } catch (error) {
    return [];
  }
}

async function filterAcceptedAssignedTickets(user, roles, userDepartments) {
  // Role-based query mapping

  const queryMapping = {
    "Master-Admin": {
      $or: [
        {
          $and: [
            { acceptedBy: { $exists: true } },
            { raisedBy: { $ne: user } },
          ],
        },
        {
          $and: [
            { assignees: { $exists: true, $ne: [] } },
            { raisedBy: { $ne: user } },
          ],
        },
      ],
    },
    "Super-Admin": {
      $or: [
        {
          $and: [
            { acceptedBy: { $exists: true } },
            { raisedBy: { $ne: user } },
          ],
        },
        {
          $and: [
            { assignees: { $exists: true, $ne: [] } },
            { raisedBy: { $ne: user } },
          ],
        },
      ],
    },
    Admin: {
      $or: [
        {
          $and: [
            { acceptedBy: { $exists: true } },
            { raisedToDepartment: { $in: userDepartments } },
          ],
        },
        {
          $and: [
            { assignees: { $exists: true, $ne: [] } },
            { raisedToDepartment: { $in: userDepartments } },
          ],
        },
      ],
    },
    Employee: {
      $or: [{ acceptedBy: user }, { assignees: { $in: [user] } }],
    },
  };

  const query = generateQuery(queryMapping, roles);
  return fetchTickets(query);
}

async function filterAcceptedTickets(user, roles, userDepartments) {
  const queryMapping = {
    "Master-Admin": {
      $and: [{ acceptedBy: { $exists: true } }, { raisedBy: { $ne: user } }],
    },
    "Super-Admin": {
      $and: [{ acceptedBy: { $exists: true } }, { raisedBy: { $ne: user } }],
    },
    Admin: {
      $and: [
        { acceptedBy: { $exists: true } },
        { raisedToDepartment: { $in: userDepartments } },
      ],
    },
    Employee: { acceptedBy: user },
  };

  const query = generateQuery(queryMapping, roles);
  return fetchTickets(query);
}

async function filterAssignedTickets(roles, userDepartments) {
  const queryMapping = {
    "Master-Admin": {
      $and: [
        { assignees: { $exists: true, $ne: [] } },
        { raisedBy: { $ne: user } },
      ],
    },
    "Super-Admin": {
      $and: [
        { assignees: { $exists: true, $ne: [] } },
        { raisedBy: { $ne: user } },
      ],
    },
    Admin: {
      $and: [
        { assignees: { $exists: true, $ne: [] } },
        { raisedToDepartment: { $in: userDepartments } },
      ],
    },
    Employee: { assignees: { $in: [user] } },
  };

  const query = generateQuery(queryMapping, roles);
  return fetchTickets(query);
}

async function filterSupportTickets(user, roles, userDepartments) {
  const roleHierarchy = ["Master-Admin", "Super-Admin", "Admin", "Employee"]; // For users with multiple roles, use query of higher entity

  const matchedRole =
    roleHierarchy.find((roleTitle) =>
      roles.some(
        (userRole) => userRole === roleTitle || userRole.endsWith(roleTitle)
      )
    ) || "None";

  try {
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
          select: "status acceptedBy assignees image",
        },
        {
          path: "user",
          select: "firstName lastName",
        },
      ])
      .select("-company")
      .lean();

    if (matchedRole === "Master-Admin" || !matchedRole === "Super-Admin") {
      return tickets;
    } else if (matchedRole === "Admin") {
      let adminTickets = tickets.filter((ticket) =>
        ticket.ticket.raisedToDepartment._id.includes(userDepartments)
      );

      return adminTickets;
    } else if (matchedRole === "Employee") {
      let employeeTickets = tickets.filter((ticket) =>
        ticket.ticket.raisedBy._id.equals(user)
      );

      return employeeTickets;
    } else return tickets;
  } catch (error) {
    return [];
  }
}

async function filterEscalatedTickets(roles, userDepartments) {
  const queryMapping = {
    "Master-Admin": {
      escalatedTo: { $exists: true, $ne: [] },
    },
    "Super-Admin": {
      escalatedTo: { $exists: true, $ne: [] },
    },
    Admin: {
      $and: [
        { raisedToDepartment: { $in: userDepartments } },
        { escalatedTo: { $exists: true, $ne: [] } },
      ],
    },
  };

  const query = generateQuery(queryMapping, roles);
  return fetchTickets(query);
}

async function filterCloseTickets(user, roles, userDepartments) {
  const queryMapping = {
    "Master-Admin": {
      $and: [{ status: "Closed" }, { raisedBy: { $ne: user } }],
    },
    "Super-Admin": {
      $and: [{ status: "Closed" }, { raisedBy: { $ne: user } }],
    },
    Admin: {
      $and: [
        { status: "Closed" },
        { raisedToDepartment: { $in: userDepartments } },
      ],
    },
    Employee: {
      $and: [{ status: "Closed" }, { acceptedBy: user }],
    },
  };

  const query = generateQuery(queryMapping, roles);
  return fetchTickets(query);
}

async function filterMyTickets(user) {
  try {
    const myTickets = await Ticket.find({ raisedBy: user })
      .populate([
        { path: "raisedBy", select: "firstName lastName" },
        { path: "raisedToDepartment", select: "name" },
      ])
      .lean()
      .exec();
    return myTickets;
  } catch (error) {
    return [];
  }
}

async function filterTodayTickets(user) {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayTickets = await Ticket.find({
      raisedBy: user,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate([
        { path: "raisedBy", select: "firstName lastName" },
        { path: "raisedToDepartment", select: "name" },
      ])
      .lean()
      .exec();

    return todayTickets;
  } catch (error) {
    return [];
  }
}

module.exports = {
  filterCloseTickets,
  filterAcceptedTickets,
  filterAcceptedAssignedTickets,
  filterSupportTickets,
  filterEscalatedTickets,
  filterAssignedTickets,
  filterMyTickets,
  filterTodayTickets,
};
