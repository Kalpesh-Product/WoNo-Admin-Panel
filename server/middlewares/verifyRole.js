const verifyRoleAndPermission = (
  allowedRoles,
  moduleId,
  subModuleId,
  action
) => {
  return async (req, res, next) => {
    try {
      const userRole = req.role; // Assumes `req.user` contains the authenticated user
      const userPermissions = req.permissions; // Assumes permissions are populated in `req.user`

      if (!userRole) return res.sendStatus(401); // Unauthorized: No role found
      if (!allowedRoles.includes(userRole)) return res.sendStatus(403); // Forbidden: Role not allowed

      // Check permissions for the module and submodule
      const hasPermission = userPermissions.some((permission) => {
        if (permission.module.toString() === moduleId.toString()) {
          // Check module-level action
          if (permission.modulePermissions[action]) return true;

          // Check submodule-level permissions
          const subModulePermission = permission.subModulePermissions.find(
            (sub) => sub.subModule.toString() === subModuleId.toString()
          );

          if (subModulePermission && subModulePermission.permissions[action]) {
            return true;
          }
        }
        return false;
      });

      if (!hasPermission) return res.sendStatus(403); // Forbidden: No permission for action

      next(); // Proceed to the next middleware if role and permission checks pass
    } catch (error) {
      console.error("Error in verifyRoleAndPermission middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = verifyRoleAndPermission;
