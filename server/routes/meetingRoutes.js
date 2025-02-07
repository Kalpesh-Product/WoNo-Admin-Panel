const upload = require("../config/multerConfig");
const {
  addMeetings,
} = require("../controllers/meetingsControllers/meetingsControllers");
const {
  addRoom,
  getRooms,
} = require("../controllers/meetingsControllers/roomsController");
const {
  addReview,
  getReviews,
  updateReview,
} = require("../controllers/meetingsControllers/reviewsController");

const router = require("express").Router();

router.post("/create-meeting", addMeetings);
router.post("/create-room", upload.single("room"), addRoom);
// router.patch("/update-room/:id", upload.single("room"), updateRoom);
router.get("/get-rooms", getRooms);
router.post("/reviews/add-review", addReview);
router.get("/reviews/get-reviews", getReviews);
router.patch("/reviews/update-review", updateReview);

module.exports = router;
