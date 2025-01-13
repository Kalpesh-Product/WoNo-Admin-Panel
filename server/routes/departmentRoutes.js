const router = require("express").Router();
const {
  addDepartment,
  assignAdmin,
  getDepartments
} = require("../controllers/departmentControllers/departmentControllers");

router.post("/add-department", addDepartment);
router.patch("/assign-admin", assignAdmin);
router.get("/get-departments", getDepartments);
module.exports = router;
