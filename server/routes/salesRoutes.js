const router = require("express").Router();

const {
  createClient,
} = require("../controllers/salesControllers/clientControllers");

router.post("/onboard-client", createClient);

module.exports = router;
