const router = require("express").Router();

const {
  createClient,
  getClients,
} = require("../controllers/salesControllers/clientControllers");

router.post("/onboard-client", createClient);
router.get("/clients", getClients);

module.exports = router;
