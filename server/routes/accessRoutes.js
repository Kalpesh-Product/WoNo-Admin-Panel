const router = require("express").Router();
const {
  userPermissions,
  grantUserPermissions,
  revokeUserPermissions,
} = require("../controllers/accessController/accessController");

router.get("/user-permissions/:id", userPermissions);
router.post("/grant-permissions", grantUserPermissions);
router.post("/revoke-permissions", revokeUserPermissions);

module.exports = router;
