const router = require("express").Router();

const {
  createClient,
  getClients,
  getClientsUnitWise,
} = require("../controllers/salesControllers/clientControllers");
const {
  createClientService,
  getClientServices,
} = require("../controllers/salesControllers/clientServiceControllers");
const {
  createLead,
  getLeads,
  bulkInsertLeads,
} = require("../controllers/salesControllers/leadsControllers");
const upload = require("../config/multerConfig");

router.post("/onboard-client", createClient);
router.get("/clients", getClients);
router.get("/unit-clients/:unitId", getClientsUnitWise);
router.post("/create-service", createClientService);
router.get("/services", getClientServices);
router.post("/create-lead", createLead);
router.get("/leads", getLeads);
router.post("/bulk-insert-leads", upload.single("leads"), bulkInsertLeads);

module.exports = router;
