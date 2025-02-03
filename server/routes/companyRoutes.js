const router = require("express").Router();
const upload = require("../config/multerConfig");
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
} = require("../controllers/companyControllers/documentControllers");
const verifyJwt = require("../middlewares/verifyJwt");

router.post("/create-company", addCompany);
router.get("/get-companies", getCompanies);
router.post("/add-employee-type", addEmployeeType);
router.post("/add-work-location", addWorkLocation);
router.post("/update-active-status/:field", updateActiveStatus);
router.post("/add-company-logo",upload.single("logo"), addCompanyLogo);
router.post("/add-shift", verifyJwt, addShift);
router.post(
  "/add-template",
  verifyJwt,
  upload.single("template"),
  uploadTemplate
);
router.post("/add-policy", verifyJwt, upload.single("policy"), addPolicy);
router.post("/add-sop", verifyJwt, upload.single("sop"), addSop);

module.exports = router;
 