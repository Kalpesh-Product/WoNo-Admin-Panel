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
  getTeamMembersTasksProjects,
} = require("../controllers/tasksControllers/tasksControllers");

router.post("/create-project", createProject);
router.get("/get-projects", getProjects);
router.put("/update-project/:id", updateProject);
router.delete("/delete-project/:id", deleteProject);
router.post("/create-tasks", createTasks);
router.get("/get-tasks", getTasks);
router.get("/get-team-tasks-projects", getTeamMembersTasksProjects);
router.get("/get-today-tasks", getTodayTasks);
router.put("/update-task/:id", updateTask);
router.delete("/delete-task/:id", deleteTask);

module.exports = router;
