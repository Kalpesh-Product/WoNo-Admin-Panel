const router = require("express").Router();

const {
  createCoworkingClient,
  getCoworkingClients,
} = require("../controllers/salesControllers/coworkingClientController");
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
const getBookedDesks = require("../controllers/salesControllers/DeskControllers");

const {
  addRevenue,
  getRevenues,
} = require("../controllers/salesControllers/revenueController");

router.post("/onboard-client", createCoworkingClient);
router.get("/clients", getCoworkingClients);
router.post("/create-service", createClientService);
router.get("/services", getClientServices);
router.post("/create-lead", createLead);
router.get("/leads", getLeads);
router.get("/booked-desks/:serviceId", getBookedDesks);
router.post("/bulk-insert-leads", upload.single("leads"), bulkInsertLeads);
router.post("/add-revenue", addRevenue);
router.get("/fetch-revenues", getRevenues);

module.exports = router;
