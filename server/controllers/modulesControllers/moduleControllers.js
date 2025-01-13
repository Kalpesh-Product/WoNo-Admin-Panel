const Module = require("../../models/Modules"); // Adjust path as needed

const addModule = async (req, res, next) => {
  try {
    const { moduleTitle, subModules } = req.body;

    // Create a new module
    const module = new Module({
      moduleTitle,
      subModules: subModules || [], // Default to an empty array if subModules is not provided
    });

    const savedModule = await module.save();

    res.status(201).json({
      message: "Module added successfully",
      module: savedModule,
    });
  } catch (error) {
    console.error("Error adding module:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { addModule };