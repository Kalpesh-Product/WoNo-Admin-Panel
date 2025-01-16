const { raiseTicket, addTicketIssue, acceptTicket, assignTicket, closeTicket, supportTicket } = require("../controllers/ticketsControllers/ticketsControllers");

const router = require("express").Router();


router.post('/add-ticket-issue',addTicketIssue)
router.post('/raise-ticket',raiseTicket)
router.post('/accept-ticket',acceptTicket)
router.post('/assign-ticket',assignTicket)
router.post('/close-ticket',closeTicket)
router.post('/support-ticket',supportTicket)

module.exports = router;