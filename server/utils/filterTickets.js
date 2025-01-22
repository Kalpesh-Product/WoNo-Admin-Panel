const { supportTicket } = require("../controllers/ticketsControllers/supportTicketsController");
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
        const acceptedTickets = await Tickets.find({
            accepted: userId,
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

    async function filterSupportTickets(userId) {
        const supportTickets = await SupportTicket.find({
            user: userId,
          })
          .populate([
            { path: "ticket", 
               populate: [
                    { 
                      path: 'raisedBy', 
                      select: 'name', 
                    },
                    { 
                      path: 'raisedToDepartment', 
                      select: 'name', 
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
            escalatedTo: {$in : userDepartments},
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

  module.exports = {filterCloseTickets,filterAcceptTickets,filterSupportTickets,filterEscalatedTickets}