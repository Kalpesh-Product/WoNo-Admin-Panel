const router = require("express").Router();

const {
  createClient,
  getClients,
} = require("../controllers/salesControllers/clientControllers");
const {
  createClientService,
  getClientServices,
} = require("../controllers/salesControllers/clientServiceControllers");
const {
  createLead,
  getLeads,
} = require("../controllers/salesControllers/leadsControllers");

router.post("/onboard-client", createClient);
router.get("/clients", getClients);
router.post("/create-service", createClientService);
router.get("/services", getClientServices);
router.post("/create-lead", createLead);
router.get("/leads", getLeads);

module.exports = router;
