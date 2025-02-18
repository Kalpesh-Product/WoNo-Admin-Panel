const router = require("express").Router();
const upload = require("../config/multerConfig");
const verifyJwt = require("../middlewares/verifyJwt");

const {
  addCompany,
  getCompanies,
  addCompanyLogo,
  updateActiveStatus,
  getCompanyData,
  getCompanyLogo
} = require("../controllers/companyControllers/companyControllers");

const {
  uploadCompanyDocument,
  getCompanyDocuments,
  uploadDepartmentDocument,
} = require("../controllers/companyControllers/documentControllers");
const { addEmployeeType } = require("../controllers/companyControllers/employeeTypeControllers");
const { addLeaveType } = require("../controllers/companyControllers/leaveTypeControllers");
const { addShift } = require("../controllers/companyControllers/shiftControllers");
const { addWorkLocation } = require("../controllers/companyControllers/workLocationControllers");
const { createDepartment } = require("../controllers/companyControllers/departmentControllers");
const getCompanyLogs = require("../controllers/companyControllers/companyLogController");

router.post("/create-company", addCompany);
router.get("/get-companies", getCompanies);
router.get("/get-company-logs", getCompanyLogs);

router.post("/add-department", createDepartment);
router.post("/add-employee-type", addEmployeeType);
router.post("/add-leave-type", addLeaveType);
router.post("/add-work-location", addWorkLocation);
router.get("/get-company-data", getCompanyData);
router.post("/update-active-status/:field", updateActiveStatus);
router.post("/add-company-logo", upload.single("logo"), addCompanyLogo);
router.get("/get-company-logo", getCompanyLogo);
router.post("/add-shift", addShift);

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
