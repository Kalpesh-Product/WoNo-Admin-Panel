const router = require("express").Router();
const {
  addAsset,
} = require("../controllers/assetsControllers/assetsControllers");
const { addSubCategory, addAssetCategory, disableCategory, disableSubCategory, getCategory, getSubCategory } = require("../controllers/assetsControllers/categoryControllers");

router.post("/create-asset", addAsset);
router.post("/create-asset-category", addAssetCategory);
router.post("/create-asset-subcategory", addSubCategory);
router.patch("/disable-asset-category", disableCategory);
router.patch("/disable-asset-subcategory", disableSubCategory);
router.get("/get-category", getCategory);
router.get("/get-subcategory/:categoryId", getSubCategory);
 


module.exports = router;
