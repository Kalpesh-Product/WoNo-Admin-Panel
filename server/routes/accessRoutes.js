const router = require("express").Router();
const {
  userPermissions,
  grantUserPermissions,
} = require("../controllers/accessController/accessController");

router.get("/user-permissions/:id", userPermissions);
router.post("/grant-permissions", grantUserPermissions);

module.exports = router;
