const router = require("express").Router();
const {
  onboardVendor,
} = require("../controllers/vendorControllers/vendorController");

router.post("/onboard-vendor", onboardVendor);
module.exports = router;
