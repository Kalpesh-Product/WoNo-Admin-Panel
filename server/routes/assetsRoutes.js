const router = require("express").Router();
const {
  addAsset,
} = require("../controllers/assetsControllers/assetsControllers");
const { addCategory, addSubCategory } = require("../controllers/assetsControllers/categoryControllers");

router.post("/create-asset", addAsset);
router.post("/create-category", addCategory);
router.post("/create-subcategory", addSubCategory);

module.exports = router;
