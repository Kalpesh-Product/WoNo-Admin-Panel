const router = require("express").Router();
const {
  createUser,
  fetchUser,
  fetchSingleUser,
  updateSingleUser,
  bulkInsertUsers,
} = require("../controllers/userControllers/userControllers");
const upload = require("../config/multerConfig");

router.post("/create-user", createUser);
router.get("/fetch-users", fetchUser);
router.get("/fetch-single-user/:id", fetchSingleUser);
router.patch("/update-single-user/:id", updateSingleUser);
router.post("/bulk-insert-users", upload.single("users"), bulkInsertUsers);

module.exports = router;
