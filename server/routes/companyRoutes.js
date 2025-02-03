const router = require("express").Router();
const upload = require("../config/multerConfig");
const {
  addCompany,
  getCompanies,
  addEmployeeType,
  addCompanyLogo,
  updateActiveStatus,
} = require("../controllers/companyControllers/companyControllers");

router.post("/create-company", addCompany);
router.get("/get-companies", getCompanies);
router.post("/add-employee-type", addEmployeeType);
router.post("/update-active-status", updateActiveStatus);
router.post("/add-company-logo",upload.single("logo"), addCompanyLogo);

module.exports = router;
 