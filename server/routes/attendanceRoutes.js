const {
  getAttendance,
  correctAttendance,
  recordAttendance,
  clockIn,
  clockOut,
  startBreak,
  endBreak,
  getAllAttendance,
  bulkInsertAttendance,
} = require("../controllers/attendanceControllers");
const upload = require("../config/multerConfig");

const router = require("express").Router();
router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.post("/start-break", startBreak);
router.post("/end-break", endBreak);
router.post("/correct-attendance", correctAttendance);
router.get("/get-all-attendance", getAllAttendance);
router.get("/get-attendance/:id", getAttendance);
router.post(
  "/bulk-insert-attandance",
  upload.single("attandance"),
  bulkInsertAttendance
);

module.exports = router;
