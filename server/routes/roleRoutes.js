const router = require("express").Router();
const {
    addRole,
    getRoles,
} = require("../controllers/rolesControllers/roleControllers");
const getRoleLogs = require("../controllers/rolesControllers/roleLogController");

router.post("/add-role", addRole)
router.get("/get-roles", getRoles)
router.get("/get-role-logs", getRoleLogs)

module.exports = router;
 