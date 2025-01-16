const { raiseATicket, raiseTicket } = require("../controllers/ticketsControllers/ticketsControllers");

const router = require("express").Router();


router.post('/raise-ticket',raiseTicket)

module.exports = router;