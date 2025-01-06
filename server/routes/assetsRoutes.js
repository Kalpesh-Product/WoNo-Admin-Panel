const router = require("express").Router();
const {
  addAsset,
} = require("../controllers/assetsControllers/assetsControllers");

router.post("/create-asset", addAsset);

module.exports = router;
