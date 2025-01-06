const leaveController = require("../controllers/leavesControllers/leavesControllers");
const leaveTypeController = require("../controllers/leavesControllers/leaveTypesControllers");
const router = require("express").Router();

// ROUTES FOR LEAVES START

// Create a new leave
router.post("/create-leave", leaveController.createLeave);

// View All Leaves
router.get("/view-all-leaves", leaveController.fetchAllLeaves);

// View All Leaves Before Today
router.get(
  "/view-all-leaves-before-today",
  leaveController.fetchLeavesBeforeToday
);

// Approve Leave
router.put("/approve-leave/:id", leaveController.approveLeave);

// Reject Leave
router.put("/reject-leave/:id", leaveController.rejectLeave);

// ROUTES FOR LEAVES END

// ROUTES FOR LEAVE TYPES START
router.post("/create-leave-type", leaveTypeController.createLeaveType);

// View All Leave types
router.get("/view-all-leave-types", leaveTypeController.fetchAllLeaveTypes);

// Delete Leave type
router.delete("/delete-leave-type/:id", leaveTypeController.deleteLeaveType);

// Soft Delete Leave type
router.put(
  "/soft-delete-leave-type/:id",
  leaveTypeController.softDeleteLeaveType
);

// ROUTES FOR LEAVE TYPES END

module.exports = router;
