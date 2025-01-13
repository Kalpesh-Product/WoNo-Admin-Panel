const router = require("express").Router();
const {
  addModule,
} = require("../controllers/modulesControllers/moduleControllers");

router.post("/add-module", addModule);

module.exports = router;
