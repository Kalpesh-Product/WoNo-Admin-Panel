const router = require("express").Router();
const {
  addCompany,
  getCompanies,
} = require("../controllers/companyControllers/companyControllers");

router.post("/create-company", addCompany);
router.get("/get-companies", getCompanies);

module.exports = router;
