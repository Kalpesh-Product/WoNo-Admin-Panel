const router = require("express").Router();

const {
    createProject,createTasks,getProjects,updateProject
} = require('../controllers/tasksControllers/tasksControllers');

router.post("/create-project", createProject);
router.post("/create-tasks", createTasks);
router.get("/get-projects",getProjects);
router.put("/create-project/:id",updateProject)

module.exports = router;