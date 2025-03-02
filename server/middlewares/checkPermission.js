const Permission = require("../models/Permissions");
const User = require("../models/hr/UserData");

const checkPermissions = (requiredPermissions, requiredRole) => {
  return async (req, res, next) => {
    try {
      const { user: userId, company: companyId } = req;

      // Step 1: Fetch User from Database
      const user = await User.findById(userId).populate("role");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Step 2: Check if User Has the Required Role
      const userRoles = user.role.map((r) => r.roleTitle); // Get user's roles
      if (userRoles.includes(requiredRole)) {
        return next(); // ✅ Role matches, proceed
      }

      // Step 3: If No Role Match, Check Permissions
      const userPermissions = await Permission.findOne({
        user: userId,
        company: companyId,
      });

      if (!userPermissions) {
        return res
          .status(403)
          .json({ error: "Access Denied: No permissions assigned" });
      }

      let hasPermission = false;

      // Step 4: Check if User Has Required Permissions
      userPermissions.deptWisePermissions.forEach((dept) => {
        dept.modules.forEach((mod) => {
          mod.submodules.forEach((sub) => {
            sub.actions.forEach((action) => {
              if (
                requiredPermissions.includes(
                  `${mod.name}.${sub.submoduleName}.${action}`
                )
              ) {
                hasPermission = true;
              }
            });
          });
        });
      });

      if (hasPermission) {
        return next(); // ✅ Permission found, proceed
      } else {
        return res
          .status(403)
          .json({ error: "Access Denied: Insufficient permissions" });
      }
    } catch (error) {
      console.error("Authorization Middleware Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

module.exports = checkPermissions;
