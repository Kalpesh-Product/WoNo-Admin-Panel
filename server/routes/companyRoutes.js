const router = require("express").Router();
const {
  addCompany,
  getCompanies,
  addWorkLocation,
  addEmployeeType,
  addShift,
  addLeaveType,
  updateCompany
} = require("../controllers/companyControllers/companyControllers");

router.post("/create-company", addCompany);
router.post("/add-work-location", addWorkLocation);
router.post("/add-employee-type", addEmployeeType);
router.post("/add-leave-type", addLeaveType);
router.post("/add-shift", addShift);
router.get("/get-companies", getCompanies);

module.exports = router;
