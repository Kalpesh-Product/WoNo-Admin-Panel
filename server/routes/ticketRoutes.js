const {
  raiseTicket,
  acceptTicket,
  assignTicket,
  closeTicket,
  escalateTicket,
  getTickets,
  fetchFilteredTickets,
  rejectTicket,
  getSingleUserTickets,
} = require("../controllers/ticketsControllers/ticketsControllers");
const upload = require("../config/multerConfig");

const {
  supportTicket,
  getSupportedTickets,
} = require("../controllers/ticketsControllers/supportTicketsController");
const {
  addTicketIssue,
  getTicketIssues,
  rejectTicketIssue,
  getNewTicketIssues,
} = require("../controllers/ticketsControllers/ticketIssueController");

const router = require("express").Router();

router.post("/add-ticket-issue", addTicketIssue);
router.get("/ticket-issues/:department", getTicketIssues);
router.get("/new-ticket-issues/:department", getNewTicketIssues);
router.delete("/reject-ticket-issue/:id", rejectTicketIssue);
router.get("/get-tickets", getTickets);
router.get("/:id", getSingleUserTickets);
router.post("/raise-ticket", upload.single("issue"), raiseTicket);
router.patch("/accept-ticket/:ticketId", acceptTicket);
router.patch("/reject-ticket/:id", rejectTicket);
router.patch("/assign-ticket/:ticketId", assignTicket);
router.patch("/escalate-ticket", escalateTicket);
router.patch("/close-ticket", closeTicket);
router.post("/support-ticket", supportTicket);
router.get("/support-tickets", getSupportedTickets);
router.get("/tickets/:flag", fetchFilteredTickets);

module.exports = router;
