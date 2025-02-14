const upload = require("../config/multerConfig");
const router = require("express").Router();
const {
  addAsset,
  editAsset,
  getAssets,
} = require("../controllers/assetsControllers/assetsControllers");
const { addCategory, addSubCategory } = require("../controllers/assetsControllers/categoryControllers");

const {
  assignAsset,
  processAssetRequest,
  revokeAsset,
  getAssetRequests,
} = require("../controllers/assetsControllers/assignAssetController");

// Asset Management Routes
router.post("/create-asset", upload.single("asset-image"), addAsset);
router.patch("/update-asset/:assetId", upload.single("asset-image"), editAsset);
router.get("/get-assets", getAssets);

// Asset Assignment Routes
router.post("/new-asset-assignment", assignAsset);
router.post("/process-asset-request", processAssetRequest);
router.post("/revoke-asset", revokeAsset);
router.get("/get-asset-requests", getAssetRequests);

module.exports = router;
