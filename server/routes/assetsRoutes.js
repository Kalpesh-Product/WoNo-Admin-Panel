const upload = require("../config/multerConfig");
const router = require("express").Router();
const {
  addAsset,
  editAsset,
  getAssets,
} = require("../controllers/assetsControllers/assetsControllers");
const { assignAsset } = require("../controllers/assetsControllers/assignAssetController");
const { addSubCategory, addAssetCategory, disableCategory, disableSubCategory, getCategory, getSubCategory } = require("../controllers/assetsControllers/categoryControllers");

router.post("/create-asset", upload.single("asset-image"), addAsset);
router.patch("/update-asset/:assetId", upload.single("asset-image"), editAsset);
router.get("/get-assets", getAssets);
router.post("/create-asset-category", addAssetCategory);
router.post("/create-asset-subcategory", addSubCategory);
router.patch("/disable-asset-category", disableCategory);
router.patch("/disable-asset-subcategory", disableSubCategory);
router.get("/get-category", getCategory);
router.get("/get-subcategory/:categoryId", getSubCategory);
router.post("/assign-asset/", assignAsset);
 


module.exports = router;
