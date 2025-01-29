const Role = require("../../models/Roles"); // Adjust path as needed
const Module = require("../../models/Modules"); // Adjust path as needed
const SubModule = require("../../models/SubModules"); // Adjust path as needed
const RoleDetails = require("../../models/roleDetails");

// const addRole = async (req, res, next) => {
//     try {
//         const { roleTitle, modulePermissions } = req.body;

//         // Validate input
//         if (!roleTitle || !Array.isArray(modulePermissions)) {
//             return res.status(400).json({
//                 message: "Role title and module permissions are required."
//             });
//         }

//         // Validate and construct modulePermissions
//         const constructedPermissions = [];
//         for (const permission of modulePermissions) {
//             const module = await Module.findById(permission.module);
//             if (!module) {
//                 return res.status(404).json({
//                     message: `Module with ID ${permission.module} not found.`
//                 });
//             }

//             const subModulePermissions = [];
//             for (const subPermission of permission.subModulePermissions) {
//                 const subModule = await SubModule.findById(subPermission.subModule);
//                 if (!subModule) {
//                     return res.status(404).json({
//                         message: `SubModule with ID ${subPermission.subModule} not found.`
//                     });
//                 }

//                 subModulePermissions.push({
//                     subModule: subModule._id,
//                     permissions: subPermission.permissions || { read: false, write: false },
//                 });
//             }

//             constructedPermissions.push({
//                 module: module._id,
//                 modulePermissions: permission.modulePermissions || { read: false, write: false },
//                 subModulePermissions,
//             });
//         }

//         // Create the role
//         const role = new Role({
//             roleTitle,
//             modulePermissions: constructedPermissions,
//         });

//         const savedRole = await role.save();

//         res.status(201).json({
//             message: "Role added successfully.",
//             role: savedRole,
//         });
//     } catch (error) {
//         console.error("Error adding role:", error);
//         res.status(500).json({
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// };


const addRole = async (req, res, next) => {
  try {
    const { roleTitle } = req.body;
    const roleExists = await Role.findOne({ roleTitle }).lean().exec();
    if (roleExists) {
      return res.status(400).json({ message: "role already exists" });
    }
    const newRole = new Role({ roleTitle });
    await newRole.save();
    res.sendStatus(204);
  } catch (error) {
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
