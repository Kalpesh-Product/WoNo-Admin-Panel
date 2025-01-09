const router = require("express").Router();
const {
  addSubModule,
} = require("../controllers/subModulesControllers/subModuleControllers");

router.post("/add-sub-module", addSubModule);

module.exports = router;
