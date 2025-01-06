const router = require("express").Router();
const {
    addRole,
    getRoles,
    updateRoles
} = require("../controllers/rolesControllers/roleControllers");

router.post("/add-role", addRole)
router.post("/update-roles", updateRoles)
router.get("/get-roles", getRoles)

module.exports = router;