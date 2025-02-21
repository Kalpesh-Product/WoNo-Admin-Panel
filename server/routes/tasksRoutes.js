const router = require("express").Router();

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/tasksControllers/ProjectControllers");
const {
  createTasks,
  getTasks,
  updateTask,
  deleteTask,
  todayTasks,
  getTodayTasks,
} = require("../controllers/tasksControllers/tasksControllers");

router.post("/create-project", createProject);
router.post("/create-tasks", createTasks);
router.get("/get-projects", getProjects);
router.put("/create-project/:id", updateProject);
router.put("/update-task/:id", updateTask);
router.get("/get-tasks", getTasks);
router.get("/get-today-tasks", getTodayTasks);
router.delete("/delete-project/:id", deleteProject);
router.delete("/delete-task/:id", deleteTask);

module.exports = router;
