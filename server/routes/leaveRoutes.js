const getLeaveLogs = require("../controllers/leavesControllers/leaveLogsControllers");
const  {requestLeave, fetchAllLeaves,
  fetchLeavesBeforeToday,
  approveLeave,
  rejectLeave,} = require("../controllers/leavesControllers/leavesControllers");
const {createLeaveType,fetchAllLeaveTypes,deleteLeaveType,softDeleteLeaveType} = require("../controllers/leavesControllers/leaveTypesControllers");
const router = require("express").Router();

router.post("/request-leave", requestLeave);
router.get("/get-leave-logs", getLeaveLogs);
router.get("/view-all-leaves", fetchAllLeaves);
router.get("/view-all-leaves-before-today",fetchLeavesBeforeToday);
router.put("/approve-leave/:id", approveLeave);
router.put("/reject-leave/:id",  rejectLeave);
router.post("/create-leave-type",  createLeaveType);
router.get("/view-all-leave-types",  fetchAllLeaveTypes);
router.delete("/delete-leave-type/:id",  deleteLeaveType);
router.put("/soft-delete-leave-type/:id", softDeleteLeaveType);

module.exports = router;
