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
router.post("/accept-ticket/:id", acceptTicket);
router.post("/reject-ticket/:id", rejectTicket);
router.post("/assign-ticket", assignTicket);
router.post("/escalate-ticket", escalateTicket);
router.post("/close-ticket", closeTicket);
router.post("/support-ticket", supportTicket);
router.get("/support-tickets", getSupportedTickets);
router.get("/", fetchFilteredTickets);

module.exports = router;
