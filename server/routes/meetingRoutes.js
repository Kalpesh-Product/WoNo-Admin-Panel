const upload = require("../config/multerConfig");
const getMeetingLogs = require("../controllers/meetingsControllers/meetingLogController");
const { addMeetings, getMeetings, addHousekeepingTask, updateHousekeepingTasks, getHousekeepingTasks, deleteHousekeepingTask, getMeetingsByTypes, cancelMeeting } = require("../controllers/meetingsControllers/meetingsControllers");
const { getReviews, addReview, replyReview } = require("../controllers/meetingsControllers/reviewsController");
const { addRoom, getRooms } = require("../controllers/meetingsControllers/roomsController");

const router = require("express").Router();
 
router.post("/create-meeting", addMeetings);
router.post("/create-room", upload.single("room"), addRoom);
router.post("/create-review",addReview);
// router.patch("/update-room/:id", upload.single("room"), updateRoom);
router.get("/get-rooms", getRooms);
router.get("/get-meetings", getMeetings);
router.get("/get-meeting-logs", getMeetingLogs);
router.get("/get-reviews", getReviews);
router.post("/add-reply", replyReview);
router.get("/get-meetings-type", getMeetingsByTypes);
router.patch("/add-housekeeping-tasks", addHousekeepingTask);
// router.patch("/update-housekeeping-tasks", updateHousekeepingTasks);
router.delete("/delete-housekeeping-tasks", deleteHousekeepingTask);
router.patch("/cancel-meeting/:meetingId", cancelMeeting);
 
module.exports = router;
