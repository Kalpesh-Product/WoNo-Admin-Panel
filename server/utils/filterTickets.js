const {
  supportTicket,
} = require("../controllers/ticketsControllers/supportTicketsController");
const SupportTicket = require("../models/tickets/supportTickets");
const Ticket = require("../models/tickets/Tickets");

async function filterCloseTickets(userDepartments,loggedInUser) {

  
  if(loggedInUser.role.roleTitle === "Master-Admin"){ 
   
    const tickets = await Ticket.find({ status: "Closed",
      raisedBy: { $ne: loggedInUser._id } }).populate([ 
      { path: "ticket" },
      { path: "raisedBy", select: "name" },
      { path: "raisedToDepartment", select: "name" },
    ])

    return  tickets
  } 

  const closedTickets = await Ticket.find({
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

async function filterAcceptTickets(userId,loggedInUser) {
 
  
  if(loggedInUser.role.roleTitle === "Master-Admin"){ 
    const tickets = await Ticket.find({$and: [
      {status: "In Progress"},
      { raisedBy: { $ne: loggedInUser._id }  },
    ],}).populate([ 
      { path: "ticket" },
      { path: "raisedBy", select: "name" },
      { path: "raisedToDepartment", select: "name" },
    ])

    return  tickets
  } 

  const acceptedTickets = await Ticket.find({
    accepted: userId,
    status: "In Progress" })
    .populate([
      { path: "ticket" },
      { path: "raisedBy", select: "name" },
      { path: "raisedToDepartment", select: "name" },
    ])
    .lean()
    .exec();

  return acceptedTickets;
}

async function filterAssignedTickets(userDepartments,loggedInUser) {

  if(loggedInUser.role.roleTitle === "Master-Admin"){ 
      
    const tickets = await Ticket.find({ assignees: {  $exists: true, $ne: [] } }).populate([ 
      { path: "ticket" },
      { path: "raisedBy", select: "name" },
      { path: "raisedToDepartment", select: "name" }
    ])

    return tickets
  } 


  const assignedTickets = await Ticket.find({
    $and: [
      { assignees: { $exists: true, $ne: []  } },
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

async function filterSupportTickets(userId,loggedInUser) {

  if(loggedInUser.role.roleTitle === "Master-Admin"){ 
      
    const tickets = await SupportTicket.find().populate([
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
    ]).lean()
    .exec();

    return tickets
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

async function filterEscalatedTickets(userDepartments,loggedInUser) {

  if(loggedInUser.role.roleTitle === "Master-Admin"){ 
      
    const tickets = await Ticket.find({ escalatedTo: { $exists: true, $ne: [] } }).populate([ 
      { path: "ticket" },
      { path: "raisedBy", select: "name" },
      { path: "raisedToDepartment", select: "name" }
    ])

    return tickets
  } 

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
