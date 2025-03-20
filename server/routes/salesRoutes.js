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

const {
  addRevenue,
  getRevenues,
} = require("../controllers/salesControllers/revenueController");
const {
  getBookedDesks,
  getAvailableDesks,
} = require("../controllers/salesControllers/DeskControllers");

router.post("/onboard-client", createClient);
router.get("/clients", getClients);
router.get("/unit-clients/:unitId", getClientsUnitWise);
router.post("/create-service", createClientService);
router.get("/services", getClientServices);
router.post("/create-lead", createLead);
router.get("/leads", getLeads);
router.get("/booked-desks/:serviceId", getBookedDesks);
router.get("/available-desks/:unitId", getAvailableDesks);
router.post("/bulk-insert-leads", upload.single("leads"), bulkInsertLeads);
router.post("/add-revenue", addRevenue);
router.get("/fetch-revenues", getRevenues);

module.exports = router;
