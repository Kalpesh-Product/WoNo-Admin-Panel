const router = require("express").Router();
const {
  fetchVisitors,
} = require("../controllers/visitorControllers/visitorController");

router.get("/fetch-visitors", fetchVisitors);

module.exports = router;
