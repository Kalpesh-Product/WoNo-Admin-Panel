const router = require("express").Router();
const upload = require("../config/multerConfig");
const {
  addCompany,
  getCompanies,
  addEmployeeType,
  addCompanyLogo,
  updateActiveStatus,
  addWorkLocation,
} = require("../controllers/companyControllers/companyControllers");

router.post("/create-company", addCompany);
router.get("/get-companies", getCompanies);
router.post("/add-employee-type", addEmployeeType);
router.post("/add-work-location", addWorkLocation);
router.post("/update-active-status/:field", updateActiveStatus);
router.post("/add-company-logo",upload.single("logo"), addCompanyLogo);

module.exports = router;
 