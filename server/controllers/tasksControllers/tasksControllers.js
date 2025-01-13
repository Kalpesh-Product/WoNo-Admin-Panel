const Project = require('../../models/Projects');
const Task = require('../../models/Tasks')

const createProject = async (req, res, next) => {
    try {
      const { Title,  description, startdate, enddate,status,assignees,Department } = req.body;
  
      const start = new Date(startdate);
      const end = new Date(enddate);
  
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
  
      const validParticipants = Array.isArray(assignees) ? assignees : [];
  
      
      const newProject = new Project({
          projectName:Title,
          description,
          startdate: start,
          enddate: end,
          status,
          
          participants: validParticipants,
        });
       
  
      if (!Title || !description || !start || !end || !status ||!Department || !assignees) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const event = await newProject.save();
      res.status(201).json({ event });
    } catch (error) {
      next(error);
    }
  };

  const getProjects = async (req, res, next) => {
    try {
      // Query the Project collection
      const projects = await Project.find()
        .populate("projectName") // Populate Department details
        .populate("description"); // Populate participants (assignees)
  
      // Respond with the fetched projects
      res.status(200).json({ projects });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const updateProject = async (req, res) => {
    try {
      const { title, description, department, assignees } = req.body;
  
      const updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        { title, description, department, assignees },
        { new: true } // Return the updated document
      );
  
      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found" });
      }
  
      res.status(200).json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };



  const createTasks = async (req, res, next) => {
    try {
      const { taskName,  description, project,status,priority } = req.body;
  
      // const start = new Date(startdate);
      // const end = new Date(enddate);
  
      // if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      //   return res.status(400).json({ message: "Invalid date format" });
      // }
      
  
      
      
      const newTask = new Task({
         taskName,
          description,
          project,
          status,
          priority,
          
        });
       
  
      if (!taskName || !description || !project || !status ||!priority ) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const event = await newTask.save();
      res.status(201).json({ event });
    } catch (error) {
      next(error);
    }
  };



  module.exports = { createProject, createTasks, getProjects,updateProject };