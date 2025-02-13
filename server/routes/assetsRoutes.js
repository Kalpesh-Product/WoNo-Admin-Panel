const upload = require("../config/multerConfig");
const router = require("express").Router();
const {
  addAsset,
  editAsset,
  getAssets,
} = require("../controllers/assetsControllers/assetsControllers");

router.post("/create-asset", upload.single("asset-image"), addAsset);
router.patch("/update-asset/:assetId", upload.single("asset-image"), editAsset);
router.get("/get-assets", getAssets);

module.exports = router;
