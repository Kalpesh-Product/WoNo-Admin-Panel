const ticketController = require("../controllers/ticketsControllers/ticketsControllers");
const router = require("express").Router();

// Create a new ticket
router.post("/create-ticket", ticketController.createTicket);

// View All Tickets
router.get("/view-all-tickets", ticketController.fetchAllTickets);

// View A single Tickets
router.get("/view-a-single-ticket/:id", ticketController.fetchASingleTicket);

// Delete Ticket
router.delete("/delete-ticket/:id", ticketController.deleteTicket);

// Edit Ticket
router.put("/edit-ticket/:id", ticketController.updateTicket);

// Accept Ticket
router.put("/accept-ticket/:id", ticketController.acceptTicket);

// Assign Ticket
router.put("/assign-ticket/:id", ticketController.assignTicket);

// Close Ticket
router.put("/close-ticket/:id", ticketController.closeTicket);

// Escalate Ticket
router.put("/escalate-ticket/:id", ticketController.escalateTicket);

// TICKET TEST USER ROUTES START

// User Signup
router.post("/signup-user", ticketController.signupUser);

// TICKET TEST USER ROUTES END

module.exports = router;
