const router = require("express").Router();
const {
  createUser,
  fetchUser
} = require("../controllers/userControllers/userControllers");

router.post("/create-user", createUser);
router.get("/fetch-users", fetchUser);

module.exports = router;
