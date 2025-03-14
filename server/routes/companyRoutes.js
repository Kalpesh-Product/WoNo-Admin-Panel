const router = require("express").Router();
const upload = require("../config/multerConfig");

const {
  addCompany,
  getCompanies,
  addCompanyLogo,
  updateActiveStatus,
  getCompanyData,
  getCompanyLogo,
  getHierarchy,
} = require("../controllers/companyControllers/companyControllers");

const {
  uploadCompanyDocument,
  getCompanyDocuments,
  uploadDepartmentDocument,
} = require("../controllers/companyControllers/documentControllers");
const {
  addEmployeeType,
} = require("../controllers/companyControllers/employeeTypeControllers");
const {
  addLeaveType,
} = require("../controllers/companyControllers/leaveTypeControllers");
const {
  addShift,
} = require("../controllers/companyControllers/shiftControllers");
const {
  addWorkLocation,
  bulkInsertWorkLocations,
  uploadCompanyLocationImage,
} = require("../controllers/companyControllers/workLocationControllers");
const {
  createDepartment,
} = require("../controllers/companyControllers/departmentControllers");

router.post("/create-company", addCompany);
router.get("/get-companies", getCompanies);
router.get("/company-hierarchy", getHierarchy);

router.post("/add-department", createDepartment);
router.post("/add-employee-type", addEmployeeType);
router.post("/add-leave-type", addLeaveType);
router.post("/add-work-location", addWorkLocation);
router.post(
  "/bulk-add-locations",
  upload.single("locations"),
  bulkInsertWorkLocations
);
router.get("/get-company-data", getCompanyData);
router.post("/update-active-status/:field", updateActiveStatus);
router.post("/add-company-logo", upload.single("logo"), addCompanyLogo);
router.get("/get-company-logo", getCompanyLogo);
router.post("/add-shift", addShift);

router.post(
  "/upload-company-document",

  upload.single("document"),
  uploadCompanyDocument
);
router.post(
  "/add-department-document/:departmentId",

  upload.single("department-document"),
  uploadDepartmentDocument
);

router.post(
  "/upload-location-image",
  upload.single("locationImage"),
  uploadCompanyLocationImage
);
router.get("/get-company-documents/:type", getCompanyDocuments);

module.exports = router;
