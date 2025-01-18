const {
  raiseTicket,
  acceptTicket,
  assignTicket,
  closeTicket,
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
router.get("/get-ticket-issue", getTicketIssue);
router.post("/raise-ticket", raiseTicket);
router.post("/accept-ticket", acceptTicket);
router.post("/assign-ticket", assignTicket);
router.post("/close-ticket", closeTicket);
router.post("/support-ticket", supportTicket);

module.exports = router;
