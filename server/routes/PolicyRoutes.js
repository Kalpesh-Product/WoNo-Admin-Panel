const policyController = require("../controllers/policyControllers/policyControllers");
const router = require("express").Router();

// ROUTES FOR LEAVE TYPES START
router.post("/create-policy", policyController.createPolicy);

// View All Employment Agreements
router.get("/view-all-policies", policyController.fetchAllPolicies);

// // // Delete Leave type
// // router.delete("/delete-leave-type/:id", leaveTypeController.deleteLeaveType);

// // // Soft Delete Employment Agreement
router.put("/soft-delete-policy/:id", policyController.softDeletePolicy);

// ROUTES FOR LEAVE TYPES END

module.exports = router;
