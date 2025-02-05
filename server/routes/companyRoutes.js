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
  uploadCompanyDocument,
  getCompanyDocuments,
  uploadDepartmentDocument,
} = require("../controllers/companyControllers/documentControllers");

router.post("/create-company", addCompany);
router.get("/get-companies", getCompanies);
router.post("/add-employee-type", addEmployeeType);
router.post("/add-work-location", addWorkLocation);
router.post("/update-active-status/:field", updateActiveStatus);
router.post("/add-company-logo", upload.single("logo"), addCompanyLogo);
router.post("/add-shift", verifyJwt, addShift);

router.post(
  "/upload-company-document",
  verifyJwt,
  upload.single("document"),
  uploadCompanyDocument
);
router.post(
  "/add-department-document/:departmentId",
  verifyJwt,
  upload.single("department-document"),
  uploadDepartmentDocument
);
router.get("/get-company-documents/:type", verifyJwt, getCompanyDocuments);

module.exports = router;
