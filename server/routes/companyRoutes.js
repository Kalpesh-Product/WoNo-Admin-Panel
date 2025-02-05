const router = require("express").Router();
const upload = require("../config/multerConfig");
const {
  addCompany,
  getCompanies,
  addCompanyLogo,
  updateActiveStatus,
  getCompanyData,
  getCompanyLogo
} = require("../controllers/companyControllers/companyControllers");
const {
  uploadTemplate,
  addPolicy,
  addSop,
  addAgreement,
} = require("../controllers/companyControllers/documentControllers");
const { addEmployeeType } = require("../controllers/companyControllers/employeeTypeControllers");
const { addLeaveType } = require("../controllers/companyControllers/leaveTypeControllers");
const { addShift } = require("../controllers/companyControllers/shiftControllers");
const { addWorkLocation } = require("../controllers/companyControllers/workLocationControllers");
const verifyJwt = require("../middlewares/verifyJwt");

router.post("/create-company", addCompany);
router.get("/get-companies", getCompanies);
router.post("/add-employee-type", addEmployeeType);
router.post("/add-leave-type", addLeaveType);
router.post("/add-work-location", addWorkLocation);
router.get("/get-company-data/:field", getCompanyData);
router.post("/update-active-status/:field", updateActiveStatus);
router.post("/add-company-logo",upload.single("logo"), addCompanyLogo);
router.get("/get-company-logo", getCompanyLogo);
router.post("/add-shift", verifyJwt, addShift);
router.post(
  "/add-template",
  verifyJwt,
  upload.single("template"),
  uploadTemplate
);
router.post("/add-policy", verifyJwt, upload.single("policy"), addPolicy);
router.post("/add-sop", verifyJwt, upload.single("sop"), addSop);
router.post("/add-template", verifyJwt, upload.single("template"), uploadTemplate);
router.post("/add-agreement", verifyJwt, upload.single("agreement"), addAgreement);

module.exports = router;
 