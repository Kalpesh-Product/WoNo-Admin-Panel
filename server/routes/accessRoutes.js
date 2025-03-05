const router = require("express").Router();
const {
  userPermissions,
  grantUserPermissions,
  revokeUserPermissions,
} = require("../controllers/accessController/accessController");

router.get("/user-permissions/:id", userPermissions);
router.post("/grant-permissions", grantUserPermissions);
router.patch("/revoke-permissions", revokeUserPermissions);

module.exports = router;
