const {
  raiseTicket,
  acceptTicket,
  assignTicket,
  closeTicket,
  escalateTicket,
  getTickets,
  fetchFilteredTickets,
} = require("../controllers/ticketsControllers/ticketsControllers");

const {
  supportTicket,
} = require("../controllers/ticketsControllers/supportTicketsController");
const {
  addTicketIssue,
  getTicketIssue,
} = require("../controllers/ticketsControllers/ticketIssueController");

const router = require("express").Router();

router.post("/add-ticket-issue", addTicketIssue);
router.get("/get-ticket-issue/:department", getTicketIssue);
router.get("/get-tickets", getTickets);
router.post("/raise-ticket", raiseTicket);
router.post("/accept-ticket", acceptTicket);
router.post("/assign-ticket", assignTicket);
router.post("/escalate-ticket", escalateTicket);
router.post("/close-ticket", closeTicket);
router.post("/support-ticket", supportTicket);
router.get("/filtered-tickets/:flag", fetchFilteredTickets);

module.exports = router;
