const upload = require("../config/multerConfig");
const { addMeetings, getMeetings } = require("../controllers/meetingsControllers/meetingsControllers");
const { addRoom, getRooms } = require("../controllers/meetingsControllers/roomsController");

const router = require("express").Router();
 

router.post("/create-meeting", addMeetings);
router.post("/create-room", upload.single("room"), addRoom);
// router.patch("/update-room/:id", upload.single("room"), updateRoom);
router.get("/get-rooms", getRooms);
router.get("/get-meetings", getMeetings);

module.exports = router;
