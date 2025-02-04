const router = require("express").Router();

const {
  requestBudget,
  fetchBudget,
} = require("../controllers/budgetControllers/budgetController");

router.post("/request-budget/:departmentId", requestBudget);
router.get("/company-budget", fetchBudget);

module.exports = router;
