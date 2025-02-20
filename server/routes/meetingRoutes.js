const upload = require("../config/multerConfig");
const { addMeetings, getMeetings, addHousekeepingTask, updateHousekeepingTasks, getHousekeepingTasks, deleteHousekeepingTask, getMeetingsByTypes } = require("../controllers/meetingsControllers/meetingsControllers");
const { getReviews, addReview, replyReview } = require("../controllers/meetingsControllers/reviewsController");
const { addRoom, getRooms } = require("../controllers/meetingsControllers/roomsController");

const router = require("express").Router();
 
router.post("/create-meeting", addMeetings);
router.post("/create-room", upload.single("room"), addRoom);
router.post("/create-review",addReview);
// router.patch("/update-room/:id", upload.single("room"), updateRoom);
router.get("/get-rooms", getRooms);
router.get("/get-meetings", getMeetings);
router.get("/get-reviews", getReviews);
router.post("/add-reply", replyReview);
router.get("/get-meetings-type", getMeetingsByTypes);
router.patch("/add-housekeeping-tasks", addHousekeepingTask);
// router.patch("/update-housekeeping-tasks", updateHousekeepingTasks);
router.delete("/delete-housekeeping-tasks", deleteHousekeepingTask);
 
module.exports = router;
