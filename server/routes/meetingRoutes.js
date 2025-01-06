const upload = require("../config/multerConfig");

const router = require("express").Router();
const {
  addMeetings,
} = require("../controllers/meetingsControllers/meetingsControllers");
const {
  addRoom,
  getRooms,
  updateRoom,
} = require("../controllers/meetingsControllers/roomsController");

router.post("/create-meeting", addMeetings);
router.post("/create-room", upload.single("room"), addRoom);
router.patch("/update-room/:id", upload.single("room"), updateRoom);
router.get("/get-rooms", getRooms);

module.exports = router;
