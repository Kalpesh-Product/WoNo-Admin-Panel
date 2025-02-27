const router = require("express").Router();

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/tasksControllers/ProjectControllers");
const {
  createTasks,
  getMyTasks,
  updateTask,
  deleteTask,
  todayTasks,
  getMyTodayTasks,
  getTeamMembersTasksProjects,
  getAssignedTasks,
} = require("../controllers/tasksControllers/tasksControllers");

router.post("/create-project", createProject);
router.get("/get-projects", getProjects);
router.patch("/update-project/:id", updateProject);
router.delete("/delete-project/:id", deleteProject);
router.post("/create-tasks", createTasks);
router.get("/get-tasks", getMyTasks);
router.get("/get-team-tasks-projects", getTeamMembersTasksProjects);
router.get("/get-today-tasks", getMyTodayTasks);
router.get("/get-assigned-tasks", getAssignedTasks);
router.patch("/update-task/:id", updateTask);
router.patch("/delete-task/:id", deleteTask);

module.exports = router;
