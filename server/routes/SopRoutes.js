const sopController = require("../controllers/sopControllers/sopControllers");
const router = require("express").Router();

// ROUTES FOR LEAVE TYPES START
router.post("/create-sop", sopController.createSop);

// View All Employment Agreements
router.get("/view-all-sops", sopController.fetchAllSops);

// // // Delete Leave type
// // router.delete("/delete-leave-type/:id", leaveTypeController.deleteLeaveType);

// // // Soft Delete Employment Agreement
router.put("/soft-delete-sop/:id", sopController.softDeleteSop);

// ROUTES FOR LEAVE TYPES END

module.exports = router;
