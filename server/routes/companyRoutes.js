const router = require("express").Router();
const upload = require("../config/multerConfig");
const verifyJwt = require("../middlewares/verifyJwt");

const {
  addCompany,
  getCompanies,
  addEmployeeType,
  addCompanyLogo,
  updateActiveStatus,
  addWorkLocation,
  addShift,
} = require("../controllers/companyControllers/companyControllers");

const {
  uploadTemplate,
  addPolicy,
  addSop,
  getAllTemplates,
  getAllSOPs,
  getAllPolicies,
} = require("../controllers/companyControllers/documentControllers");

router.post("/create-company", addCompany);
router.get("/get-companies", getCompanies);
router.post("/add-employee-type", addEmployeeType);
router.post("/add-work-location", addWorkLocation);
router.post("/update-active-status/:field", updateActiveStatus);
router.post("/add-company-logo", upload.single("logo"), addCompanyLogo);
router.post("/add-shift", verifyJwt, addShift);
router.post(
  "/add-template",
  verifyJwt,
  upload.single("template"),
  uploadTemplate
);
router.post("/add-policy", verifyJwt, upload.single("policy"), addPolicy);
router.post("/add-sop", verifyJwt, upload.single("sop"), addSop);
router.get("/get-templates", verifyJwt, getAllTemplates);
router.get("/get-sops", verifyJwt, getAllSOPs);
router.get("/get-policies", verifyJwt, getAllPolicies);

module.exports = router;
