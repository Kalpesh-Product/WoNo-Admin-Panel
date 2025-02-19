const Role = require("../../models/roles/Roles"); // Adjust path as needed
const { createLog } = require("../../utils/moduleLogs");

const addRole = async (req, res, next) => {
  const { user, company, ip } = req;
  const path = "roles/RoleLogs";
  const action = "Add Role";

  try {
    const { roleTitle } = req.body;

    // Check if role already exists
    const roleExists = await Role.findOne({ roleTitle }).lean().exec();
    if (roleExists) {
      await createLog(path, action, "Role already exists", "Failed", user, ip, company, { roleTitle });
      return res.status(400).json({ message: "Role already exists" });
    }

    // Create and save the new role
    const newRole = new Role({ roleTitle });
    await newRole.save();

    await createLog(path, action, "Role added successfully", "Success", user, ip, company,newRole._id, { roleTitle });

    res.status(201).json({message:"Role added successfully"});
  } catch (error) {
     await createLog(path, action, "Error adding role", "Failed", user, ip, company,id=null, { error: error.message });
    next(error);
  }
};


const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().lean().exec();
    return res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

module.exports = { addRole, getRoles };
