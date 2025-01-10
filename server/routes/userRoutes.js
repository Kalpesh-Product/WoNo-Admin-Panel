const router = require("express").Router();
const {
  createUser,
  fetchUser,
  fetchSingleUser,
  updateSingleUser,
} = require("../controllers/userControllers/userControllers");

router.post("/create-user", createUser);
router.get("/fetch-users", fetchUser);
router.get("/fetch-single-user/:id", fetchSingleUser);
router.patch("/update-single-user/:id", updateSingleUser);

module.exports = router;
