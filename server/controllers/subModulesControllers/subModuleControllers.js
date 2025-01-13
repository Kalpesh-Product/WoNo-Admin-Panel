const SubModule = require("../../models/SubModules"); // Adjust path as needed
const Module = require("../../models/Modules"); // Adjust path as needed

const addSubModule = async (req, res, next) => {
  try {
    const { moduleID, subModuleTitle } = req.body;

    // Validate the module reference
    if (!moduleID) {
      return res.status(400).json({ message: "Module ID is required" });
    }

    // Create a new submodule
    const subModule = new SubModule({
      moduleID,
      subModuleTitle,
    });

    const savedSubModule = await subModule.save();

    // Add the submodule reference to the module's subModules array
    const module = await Module.findById(moduleID);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    module.subModules.push(savedSubModule._id);
    await module.save();

    res.status(201).json({
      message: "SubModule added successfully and linked to the module",
      subModule: savedSubModule,
    });
  } catch (error) {
    console.error("Error adding submodule:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = { addSubModule };
