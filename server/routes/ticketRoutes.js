const {
  raiseTicket,
  acceptTicket,
  assignTicket,
  closeTicket,
  escalateTicket,
  getTickets,
  fetchFilteredTickets,
  fetchSingleUserTickets,
  rejectTicket,
} = require("../controllers/ticketsControllers/ticketsControllers");

const {
  supportTicket,
  getSupportedTickets,
} = require("../controllers/ticketsControllers/supportTicketsController");
const {
  addTicketIssue,
  getTicketIssue,
} = require("../controllers/ticketsControllers/ticketIssueController");

const router = require("express").Router();

router.post("/add-ticket-issue", addTicketIssue);
router.get("/get-ticket-issue/:department", getTicketIssue);
router.get("/get-tickets", getTickets);
router.get("/:id", fetchSingleUserTickets);
router.post("/raise-ticket", raiseTicket);
router.post("/accept-ticket/:id", acceptTicket);
router.post("/reject-ticket/:id", rejectTicket);
router.post("/assign-ticket", assignTicket);
router.post("/escalate-ticket", escalateTicket);
router.post("/close-ticket", closeTicket);
router.post("/support-ticket", supportTicket);
router.get("/support-tickets", getSupportedTickets);
router.get("/", fetchFilteredTickets);

module.exports = router;
