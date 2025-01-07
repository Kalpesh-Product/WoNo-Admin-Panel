const Role = require("../models/Roles");

const checkScope = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const { role } = req.user; // Extract role from the JWT payload

      if (!role) {
        return res
          .status(403)
          .json({ message: "Role not found, access denied" });
      }

      // Fetch the full role document from the database
      const userRole = await Role.findById(role._id)
        .populate({
          path: "modulePermissions.module",
          select: "moduleTitle",
        })
        .populate({
          path: "modulePermissions.subModulePermissions.subModule",
          select: "subModuleTitle",
        })
        .lean();

      if (!userRole) {
        return res
          .status(403)
          .json({ message: "Role does not exist, access denied" });
      }

      // Check permissions against requiredPermissions
      let hasPermission = false;

      for (const modulePerm of userRole.modulePermissions) {
        // Check if the main module matches
        if (requiredPermissions.module === modulePerm.module.moduleTitle) {
          const mainModulePermissions = modulePerm.permissions; //modulePermissions

          // If main module has only "read", enforce "read-only" for all submodules
          if (mainModulePermissions.read && !mainModulePermissions.write) {
            hasPermission = modulePerm.subModulePermissions.every(
              (subModulePerm) =>
                requiredPermissions.permissions.every(
                  (perm) => perm === "read" && subModulePerm.permissions.read
                )
            );
          }
          // If main module has both "read" and "write"
          else if (mainModulePermissions.read && mainModulePermissions.write) {
            hasPermission = modulePerm.subModulePermissions.some(
              (subModulePerm) =>
                subModulePerm.subModule.subModuleTitle ===
                  requiredPermissions.subModule &&
                requiredPermissions.permissions.every((perm) => {
                  if (perm === "write") {
                    return (
                      subModulePerm.permissions.write &&
                      subModulePerm.permissions.read
                    );
                  }
                  return subModulePerm.permissions[perm];
                })
            );
          }
        }

        if (hasPermission) break;
      }

      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: "Access denied, insufficient permissions" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = checkScope;