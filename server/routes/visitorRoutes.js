const router = require("express").Router();
const {
  fetchVisitors,
  addVisitor,
  updateVisitor,
} = require("../controllers/visitorControllers/visitorController");

router.get("/fetch-visitors", fetchVisitors);
router.post("/add-visitor", addVisitor);
router.patch("/update-visitor/:visitorId", updateVisitor);

module.exports = router;
