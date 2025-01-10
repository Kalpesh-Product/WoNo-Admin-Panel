const router = require("express").Router();
const {
  grantAccess,
} = require("../controllers/accessController/accessController");

router.patch("/grant-access/:id", grantAccess);
module.exports = router;
