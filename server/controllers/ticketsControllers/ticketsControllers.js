// const Ticket = require("../../models/TicketTest");
const Ticket = require("../../models/Tickets");
const TicketUsersTest = require("../../models/TicketUsersTest");
const bcrypt = require("bcryptjs");
// POST - Raise a ticket

// const createTicket = async (req, res) => {
//   try {
//     // Get the sent in data off request body
//     // const ticketIdFromRequestBody = req.body.ticketId;
//     const raisedByFromRequestBody = req.body.raisedBy;
//     const descriptionFromRequestBody = req.body.description;
//     const selectedDepartmentFromRequestBody = req.body.selectedDepartment;

//     // Create a ticket with it (take the values from the request body / frontend and insert in the database)
//     const ourCreatedTicket = await Ticket.create({
//       //   ticketId: ticketIdFromRequestBody,
//       raisedBy: raisedByFromRequestBody,
//       description: descriptionFromRequestBody,
//       selectedDepartment: selectedDepartmentFromRequestBody,
//       // resolvedStatus: req.body.resolvedStatus ?? false,
//     });

//     // respond with the new ticket (this will be our response in postman / developer tools)
//     res.json({ ticket: ourCreatedTicket });
//   } catch (error) {
//     console.log(error);
//   }
// };

const createTicket = async (req, res) => {
  try {
    // Get the sent-in data from the request body
    const raisedByFromRequestBody = req.body.raisedBy;
    const descriptionFromRequestBody = req.body.description;
    const selectedDepartmentFromRequestBody = req.body.selectedDepartment;

    // Create a ticket with the provided data
    const ourCreatedTicket = await Ticket.create({
      raisedBy: raisedByFromRequestBody,
      description: descriptionFromRequestBody,
      selectedDepartment: selectedDepartmentFromRequestBody,
      // Default initial status
      // status: "Open",
      accepted: { acceptedStatus: false },
      escalation: {
        escalationToAdmin: { isEscalated: false, escalatedTo: null },
        escalationToMasterAdmin: { isEscalated: false, escalatedTo: null },
      },
    });

    // Start the escalation timer if the ticket is not "Closed"
    let secondsElapsed = 0; // Counter for elapsed time

    const timer = setInterval(async () => {
      secondsElapsed += 1;
      console.log(`Seconds elapsed: ${secondsElapsed}`);

      if (secondsElapsed === 900) {
        // Escalation after 1 minute
        const ticket = await Ticket.findById(ourCreatedTicket._id);
        if (ticket && ticket.status !== "Closed") {
          await Ticket.findByIdAndUpdate(ticket._id, {
            "escalation.escalationToAdmin.isEscalated": true,
            "escalation.escalationToAdmin.escalatedTo": "Admin",
            "escalation.currentlyEscalatedTo": "Admin",
            "escalation.isEscalated": true,
          });
          console.log("Escalated to Admin after 1 minute.");
        }
      }

      if (secondsElapsed === 1800) {
        // Escalation after 2 minutes
        const ticket = await Ticket.findById(ourCreatedTicket._id);
        if (ticket && ticket.status !== "Closed") {
          await Ticket.findByIdAndUpdate(ticket._id, {
            "escalation.escalationToMasterAdmin.isEscalated": true,
            // "escalation.escalationToMasterAdmin.escalatedTo": "Master Admin",
            "escalation.escalationToAdmin.escalatedTo": "Master Admin",
            "escalation.currentlyEscalatedTo": "Master Admin",
            "escalation.isEscalated": true,
            // selectedDepartment: "TopManagement",
            escalatedDepartment: "TopManagement",
          });
          console.log("Escalated to Master Admin after 2 minutes.");
        }

        // Stop the timer after 2 minutes
        console.log("Timer stopped after 120 seconds.");
        clearInterval(timer);
      }
    }, 1000); // Run every 1 second

    // Respond with the new ticket
    res.json({ ticket: ourCreatedTicket });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// GET - Fetch all tickets
// const fetchAllTickets = async (req, res) => {
//   try {
//     // Find the tickets
//     const listOfAllTickets = await Ticket.find();

//     // Respond with them
//     res.json({ tickets: listOfAllTickets });
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(400);
//   }
// };

const fetchAllTickets = async (req, res) => {
  try {
    // Find the tickets and sort them in descending order by createdAt
    const listOfAllTickets = await Ticket.find().sort({ createdAt: -1 });

    // Respond with the sorted list
    res.json({ tickets: listOfAllTickets });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// GET - Fetch a single ticket
const fetchASingleTicket = async (req, res) => {
  try {
    // Get the id off the url
    const ticketIdFromTheUrl = req.params.id;

    // Find the ticket using that id
    const ticketFromTheDb = await Ticket.findOne({
      _id: ticketIdFromTheUrl,
    });

    // Respond with the ticket
    res.json({ ticket: ticketFromTheDb });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// DELETE - delete ticket

const deleteTicket = async (req, res) => {
  try {
    // get id off the url
    const ticketIdFromTheUrl = req.params.id;

    // Delete the record
    await Ticket.deleteOne({ _id: ticketIdFromTheUrl });

    // Respond with a message (eg: ticket deleted)
    res.json({ success: "Record deleted" });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// PUT - edit ticket
const updateTicket = async (req, res) => {
  try {
    // Get the id off the url
    const ticketIdFromTheUrl = req.params.id;

    // Get the data off the req body
    const raisedByFromRequestBody = req.body.raisedBy;
    const descriptionFromRequestBody = req.body.description;

    // Find and update the record
    await Ticket.findOneAndUpdate(
      { _id: ticketIdFromTheUrl },
      {
        raisedBy: raisedByFromRequestBody,
        description: descriptionFromRequestBody,
      }
    );

    //   Find updated ticket (using it's id)
    const updatedTicket = await Ticket.findById(ticketIdFromTheUrl);

    // Respond with the updated ticket (after finding it)
    res.json({ ticket: updatedTicket });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// PUT - Accept ticket
const acceptTicket = async (req, res) => {
  try {
    // Get the id off the url
    const ticketIdFromTheUrl = req.params.id;

    // Get the data off the req body
    const assignedMemberFromRequestBody = req.body.assignedMember;
    // const descriptionFromRequestBody = req.body.description;

    // Find and update the record
    await Ticket.findOneAndUpdate(
      { _id: ticketIdFromTheUrl },
      {
        assignedMember: assignedMemberFromRequestBody,
        // description: descriptionFromRequestBody,
        "accepted.acceptedStatus": true,
        status: "In Process",
      },
      { new: true } // Returns the updated document
    );

    //   Find updated ticket (using it's id)
    const updatedTicket = await Ticket.findById(ticketIdFromTheUrl);

    // Respond with the updated ticket (after finding it)
    res.json({ ticket: updatedTicket });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// PUT - Assign ticket
const assignTicket = async (req, res) => {
  try {
    // Get the id off the url
    const ticketIdFromTheUrl = req.params.id;

    // Get the data off the req body
    const assignedMemberFromRequestBody = req.body.assignedMember;
    // const descriptionFromRequestBody = req.body.description;

    // Find and update the record
    await Ticket.findOneAndUpdate(
      { _id: ticketIdFromTheUrl },
      {
        assignedMember: assignedMemberFromRequestBody,
        // description: descriptionFromRequestBody,
        "accepted.acceptedStatus": true,
        status: "In Process",
      },
      { new: true } // Returns the updated document
    );

    //   Find updated ticket (using it's id)
    const updatedTicket = await Ticket.findById(ticketIdFromTheUrl);

    // Respond with the updated ticket (after finding it)
    res.json({ ticket: updatedTicket });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// const acceptTicket = async (req, res) => {
//   try {
//     // Get the id off the URL
//     const ticketIdFromTheUrl = req.params.id;

//     // Get the data off the req body
//     const assignedMemberFromRequestBody = req.body.assignedMember;

//     // Find and update the record
//     await Ticket.findOneAndUpdate(
//       { _id: ticketIdFromTheUrl },
//       {
//         assignedMember: assignedMemberFromRequestBody,
//         "accepted.acceptedStatus": true,
//       },
//       { new: true } // Returns the updated document
//     );

//     // Find updated ticket
//     const updatedTicket = await Ticket.findById(ticketIdFromTheUrl);

//     // Schedule escalations if the ticket is not "Closed"
//     if (updatedTicket.status !== "Closed") {
//       // Escalation after 1 minute
//       setTimeout(async () => {
//         const ticket = await Ticket.findById(ticketIdFromTheUrl);
//         if (ticket && ticket.status !== "Closed") {
//           await Ticket.findByIdAndUpdate(ticketIdFromTheUrl, {
//             "escalation.escalationToAdmin.isEscalated": true,
//             "escalation.escalationToAdmin.escalatedTo": "Admin",
//           });
//           console.log("Escalated to Admin");
//         }
//       }, 20000); // 1 minute in milliseconds
//       // }, 60000); // 1 minute in milliseconds

//       // Escalation after 2 minutes
//       setTimeout(async () => {
//         const ticket = await Ticket.findById(ticketIdFromTheUrl);
//         if (ticket && ticket.status !== "Closed") {
//           await Ticket.findByIdAndUpdate(ticketIdFromTheUrl, {
//             "escalation.escalationToMasterAdmin.isEscalated": true,
//             // "escalation.escalationToMasterAdmin.escalatedTo": "Master Admin",
//             "escalation.escalationToAdmin.escalatedTo": "Master Admin",
//           });
//           console.log("Escalated to Master Admin");
//         }
//       }, 40000); // 2 minutes in milliseconds
//       // }, 120000); // 2 minutes in milliseconds
//     }

//     // Respond with the updated ticket
//     res.json({ ticket: updatedTicket });
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(400);
//   }
// };

// const acceptTicket = async (req, res) => {
//   try {
//     // Get the id off the URL
//     const ticketIdFromTheUrl = req.params.id;

//     // Get the data off the req body
//     const assignedMemberFromRequestBody = req.body.assignedMember;

//     // Find and update the record
//     await Ticket.findOneAndUpdate(
//       { _id: ticketIdFromTheUrl },
//       {
//         assignedMember: assignedMemberFromRequestBody,
//         "accepted.acceptedStatus": true,
//       },
//       { new: true } // Returns the updated document
//     );

//     // Find updated ticket
//     const updatedTicket = await Ticket.findById(ticketIdFromTheUrl);

//     // Schedule escalations if the ticket is not "Closed"
//     if (updatedTicket.status !== "Closed") {
//       let secondsElapsed = 0; // Counter to track seconds

//       // Start the timer
//       const timer = setInterval(() => {
//         secondsElapsed += 1;
//         console.log(`Seconds elapsed: ${secondsElapsed}`);

//         if (secondsElapsed === 10) {
//           // Escalation after 1 minute
//           Ticket.findById(ticketIdFromTheUrl).then((ticket) => {
//             if (ticket && ticket.status !== "Closed") {
//               Ticket.findByIdAndUpdate(ticketIdFromTheUrl, {
//                 "escalation.escalationToAdmin.isEscalated": true,
//                 "escalation.escalationToAdmin.escalatedTo": "Admin",
//               }).then(() => console.log("Escalated to Admin"));
//             }
//           });
//         }

//         if (secondsElapsed === 20) {
//           // Escalation after 2 minutes
//           Ticket.findById(ticketIdFromTheUrl).then((ticket) => {
//             if (ticket && ticket.status !== "Closed") {
//               Ticket.findByIdAndUpdate(ticketIdFromTheUrl, {
//                 "escalation.escalationToMasterAdmin.isEscalated": true,
//                 // "escalation.escalationToMasterAdmin.escalatedTo":
//                 //   "Master Admin",

//                 "escalation.escalationToAdmin.escalatedTo": "Master Admin",
//               }).then(() => console.log("Escalated to Master Admin"));
//             }
//           });

//           console.log("Timer stopped after 120 seconds.");
//           clearInterval(timer); // Stops the interval
//         }
//       }, 1000); // Runs every 1 second
//     }

//     // Respond with the updated ticket
//     res.json({ ticket: updatedTicket });
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(400);
//   }
// };

// PUT - close ticket
const closeTicket = async (req, res) => {
  try {
    // Get the id off the url
    const ticketIdFromTheUrl = req.params.id;

    // Get the data off the req body
    // const assignedMemberFromRequestBody = req.body.assignedMember;
    // const descriptionFromRequestBody = req.body.description;

    // Find and update the record
    await Ticket.findOneAndUpdate(
      { _id: ticketIdFromTheUrl },
      {
        // assignedMember: assignedMemberFromRequestBody,
        // description: descriptionFromRequestBody,
        status: "Closed",
      },
      { new: true } // Returns the updated document
    );

    //   Find updated ticket (using it's id)
    const updatedTicket = await Ticket.findById(ticketIdFromTheUrl);

    // Respond with the updated ticket (after finding it)
    res.json({ ticket: updatedTicket });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// PUT - escalate ticket
const escalateTicket = async (req, res) => {
  try {
    // Get the id off the url
    const ticketIdFromTheUrl = req.params.id;

    // Get the data off the req body
    // const assignedMemberFromRequestBody = req.body.assignedMember;
    // const descriptionFromRequestBody = req.body.description;

    // Find and update the record
    await Ticket.findOneAndUpdate(
      { _id: ticketIdFromTheUrl },
      {
        // assignedMember: assignedMemberFromRequestBody,
        // description: descriptionFromRequestBody,
        "escalation.escalationToAdmin.isEscalated": true,
        "escalation.isEscalated": true,
        "escalation.escalationToAdmin.escalatedTo": "Admin",
      },
      { new: true } // Returns the updated document
    );

    //   Find updated ticket (using it's id)
    const updatedTicket = await Ticket.findById(ticketIdFromTheUrl);

    // Respond with the updated ticket (after finding it)
    res.json({ ticket: updatedTicket });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// TEST USER ROUTES START

const signupUser = async (req, res) => {
  try {
    // Get the email and password off the req body
    const nameFromRequestBody = req.body.name;
    const emailFromRequestBody = req.body.email;
    const roleFromRequestBody = req.body.role;
    const departmentFromRequestBody = req.body.department;
    const passwordFromRequestBody = req.body.password;
    const designationFromRequestBody = req.body.designation;
    const companyFromRequestBody = req.body.company;
    const phoneFromRequestBody = req.body.phone;

    //   Hash password
    const hashedPassword = bcrypt.hashSync(passwordFromRequestBody, 8);

    // Create a user with the data (in the DB)
    await TicketUsersTest.create({
      name: nameFromRequestBody,
      email: emailFromRequestBody,
      role: roleFromRequestBody,
      department: departmentFromRequestBody,
      password: hashedPassword,
      designation: designationFromRequestBody,
      company: companyFromRequestBody,
      phone: phoneFromRequestBody,
    });

    // respond with the new created user
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
// TEST USER ROUTES END

module.exports = {
  createTicket,
  fetchAllTickets,
  fetchASingleTicket,
  deleteTicket,
  updateTicket,
  acceptTicket,
  assignTicket,
  closeTicket,
  escalateTicket,
  signupUser,
};
