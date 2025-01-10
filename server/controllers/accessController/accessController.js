const Roles = require("../../models/Roles");
const User = require("../../models/User");
const mongoose = require("mongoose");

const grantAccess = async (req, res, next) => {
  try {
    const { user } = req; // Current user from middleware
    const { id } = req.params; // Target user ID
    const { moduleId, permissions, subModules } = req.body; // Module and permissions to grant

    if (!user) {
      return res.sendStatus(401); // Unauthorized
    }

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(moduleId)
    ) {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    // Find the target user by ID
    const targetUser = await User.findById(id).populate("role");

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the role exists
    const role = await Role.findById(targetUser.role);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Find or create the module in user's role
    let module = role.modulePermissions.find(
      (mod) => mod.module.toString() === moduleId
    );

    if (!module) {
      // If module doesn't exist, create it
      module = {
        module: moduleId,
        modulePermissions: {
          read: permissions?.read || false,
          write: permissions?.write || false,
        },
        subModulePermissions: [],
      };
      role.modulePermissions.push(module);
    } else {
      // If module exists, update the permissions
      module.modulePermissions.read =
        permissions?.read || module.modulePermissions.read;
      module.modulePermissions.write =
        permissions?.write || module.modulePermissions.write;
    }

    // Handle submodules if provided
    if (subModules && Array.isArray(subModules)) {
      subModules.forEach((subModule) => {
        let existingSubModule = module.subModulePermissions.find(
          (sub) => sub.subModule.toString() === subModule.subModuleId
        );

        if (!existingSubModule) {
          // If submodule doesn't exist, add it
          module.subModulePermissions.push({
            subModule: subModule.subModuleId,
            permissions: {
              read: subModule.permissions?.read || false,
              write: subModule.permissions?.write || false,
            },
          });
        } else {
          // If submodule exists, update its permissions
          existingSubModule.permissions.read =
            subModule.permissions?.read || existingSubModule.permissions.read;
          existingSubModule.permissions.write =
            subModule.permissions?.write || existingSubModule.permissions.write;
        }
      });
    }

    // Save the updated role
    await role.save();

    return res
      .status(200)
      .json({ message: "Access granted successfully", role });
  } catch (error) {
    next(error);
  }
};

module.exports = { grantAccess };
