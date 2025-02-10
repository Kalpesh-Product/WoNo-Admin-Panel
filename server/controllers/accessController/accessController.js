const Roles = require("../../models/Roles");
const User = require("../../models/UserData");
const mongoose = require("mongoose");

const grantAccess = async (req, res, next) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const { moduleId, permissions, subModules } = req.body;

    if (!user) {
      return res.status(401).json({ message: "UnAuthorized User" });
    }

    // if (
    //   !mongoose.Types.ObjectId.isValid(id) ||
    //   !mongoose.Types.ObjectId.isValid(moduleId)
    // ) {
    //   return res.status(400).json({ message: "Invalid ID provided" });
    // }

    // Find the target user by ID
    const targetUser = await User.findById(id).populate("role").lean().exec();

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the role exists
    const role = await Roles.findById(targetUser.role._id).lean().exec();
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Find or create the module in user's role
    let module = role.modulePermissions.find(
      (mod) => mod.module.toString() === moduleId
    );

    if (!module) {
      // If module doesn't exist, create it
      if (permissions?.write && "read" in permissions) {
        permissions.read = true;
      }
      module = {
        module: moduleId,
        modulePermissions: {
          read: permissions?.read || false,
          write: permissions?.write || false,
        },
        subModulePermissions: [],
      };

      // Handle submodules during creation
      if (subModules && Array.isArray(subModules)) {
        subModules.forEach((subModule) => {
          if (
            !subModule.subModuleId ||
            !mongoose.Types.ObjectId.isValid(subModule.subModuleId)
          ) {
            throw new Error("Invalid subModuleId");
          }
          if (!subModule.permissions) {
            throw new Error("Missing permissions in subModule");
          }

          if (subModule.permissions?.write && "read" in subModule.permissions) {
            subModule.permissions.read = true;
          }

          module.subModulePermissions.push({
            subModule: subModule.subModuleId,
            permissions: {
              read: subModule.permissions?.read || false,
              write: subModule.permissions?.write || false,
            },
          });
        });
      }

      // Push the new module into role.modulePermissions
      role.modulePermissions.push(module);
    } else {
      // If module exists, update the permissions
      module.modulePermissions.read =
        permissions?.read || module.modulePermissions.read;
      module.modulePermissions.write =
        permissions?.write || module.modulePermissions.write;

      // Handle submodules for an existing module
      if (subModules && Array.isArray(subModules)) {
        subModules.forEach((subModule) => {
          if (
            !subModule.subModuleId ||
            !mongoose.Types.ObjectId.isValid(subModule.subModuleId)
          ) {
            throw new Error("Invalid subModuleId");
          }
          if (!subModule.permissions) {
            throw new Error("Missing permissions in subModule");
          }

          if (subModule.permissions?.write && "read" in subModule.permissions) {
            subModule.permissions.read = true;
          }

          let existingSubModule = module.subModulePermissions.find(
            (sub) =>
              sub.subModule.toString() === subModule.subModuleId.toString()
          );

          if (!existingSubModule) {
            // Add new submodule
            module.subModulePermissions.push({
              subModule: subModule.subModuleId,
              permissions: {
                read: subModule.permissions?.read || false,
                write: subModule.permissions?.write || false,
              },
            });
          } else {
            // Update existing submodule permissions
            existingSubModule.permissions.read =
              subModule.permissions?.read || existingSubModule.permissions.read;
            existingSubModule.permissions.write =
              subModule.permissions?.write ||
              existingSubModule.permissions.write;
          }
        });
      }
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
