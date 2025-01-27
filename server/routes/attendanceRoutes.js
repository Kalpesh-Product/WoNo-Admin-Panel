const { getAttendance, correctAttendance, recordAttendance } = require("../controllers/attendanceControllers")

const router = require("express").Router()

router.post("/record-attendance",recordAttendance)
router.post("/correct-attendance",correctAttendance)
router.get("/get-attendance",getAttendance)

module.exports = router