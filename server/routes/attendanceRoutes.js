const {
  getAttendance,
  correctAttendance,
  recordAttendance,
  clockIn,
  clockOut,
  startBreak,
  endBreak,
  getAllAttendance,
} = require("../controllers/attendanceControllers");
const getAttendanceLogs = require("../controllers/attendanceLogsController");

const router = require("express").Router();
router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.post("/start-break", startBreak);
router.post("/end-break", endBreak);
router.post("/correct-attendance", correctAttendance);
router.get("/get-all-attendance", getAllAttendance);
router.get("/get-attendance/:id", getAttendance);
router.get("/get-attendance-logs", getAttendanceLogs);

module.exports = router;
