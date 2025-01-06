const router = require("express").Router();
const {
  getAllEvents,
  createEvent,
  getNormalEvents,
  getHolidays,
} = require("../controllers/eventsController/eventsController");



router.post("/create-event", createEvent);
router.get("/all-events", getAllEvents);
router.get("/get-events", getNormalEvents);
router.get("/get-holidays", getHolidays);

module.exports = router;
