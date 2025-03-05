const Permissions = require("../../models/Permissions");
const masterPermissions = require("../../config/masterPermissions");
const Company = require("../../models/hr/Company");
const CustomError = require("../../utils/customErrorlogs");
const UserData = require("../../models/hr/UserData");
const { createLog } = require("../../utils/moduleLogs");

const userPermissions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const companyId = req.company;

    const company = await Company.findById(companyId).populate(
      "selectedDepartments"
    );
    if (!company) return res.status(404).json({ error: "Company not found" });

    const selectedDepartments = company.selectedDepartments.map((dept) =>
      dept.department.toString()
    );

    // Step 2: Fetch user's granted permissions
    const userPermissions = await Permissions.findOne({
      user: id,
      company: companyId,
    });

    let grantedPermissionsMap = {};

    if (userPermissions) {
      userPermissions.deptWisePermissions.forEach((deptPerm) => {
        const deptId = deptPerm.department.toString();
        grantedPermissionsMap[deptId] = {};

        deptPerm.modules.forEach((mod) => {
          grantedPermissionsMap[deptId][mod.moduleName] = {};

          mod.submodules.forEach((sub) => {
            grantedPermissionsMap[deptId][mod.moduleName][sub.submoduleName] =
              sub.actions;
          });
        });
      });
    }

    // Step 3: Prepare the response JSON
    let permissionResponse = [];

    masterPermissions.forEach((dept) => {
      // Only process if the department is selected by the company
      if (selectedDepartments.includes(dept.departmentId)) {
        let deptData = {
          departmentId: dept.departmentId,
          departmentName: dept.departmentName,
          modules: [],
        };

        dept.modules.forEach((mod) => {
          let moduleData = {
            name: mod.name,
            submodules: [],
          };

          mod.submodules.forEach((sub) => {
            const grantedActions =
              grantedPermissionsMap[dept.departmentId]?.[mod.name]?.[
                sub.submoduleName
              ] || [];
            const availableActions =
              grantedActions.length > 0
                ? sub.actions.filter(
                    (action) => !grantedActions.includes(action)
                  )
                : sub.actions; // If no granted actions, all actions are available

            moduleData.submodules.push({
              submoduleName: sub.submoduleName,
              grantedActions,
              availableActions,
            });
          });

          deptData.modules.push(moduleData);
        });

        permissionResponse.push(deptData);
      }
    });

    if (!userPermissions) {
      permissionResponse = masterPermissions
        .filter((dept) => selectedDepartments.includes(dept.departmentId))
        .map((dept) => ({
          departmentId: dept.departmentId,
          departmentName: dept.departmentName,
          modules: dept.modules.map((mod) => ({
            name: mod.name,
            submodules: mod.submodules.map((sub) => ({
              submoduleName: sub.submoduleName,
              grantedActions: [],
              availableActions: sub.actions,
            })),
          })),
        }));
    }

    return res.status(200).json(permissionResponse);
  } catch (error) {
    next(error);
  }
};

const grantUserPermissions = async (req, res, next) => {
  try {
    const { userId, permissions } = req.body;
    const companyId = req.company;

    if (
      !userId ||
      !companyId ||
      !Array.isArray(permissions) ||
      permissions.length === 0
    ) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const foundUser = await UserData.findOne({ _id: userId })
      .select("permissions")
      .lean()
      .exec();
    if (!foundUser) return res.status(404).json({ error: "User not found" });

    // Step 2: Fetch Company & Validate Departments
    const company = await Company.findById(companyId).populate(
      "selectedDepartments"
    );
    if (!company) return res.status(404).json({ error: "Company not found" });

    const selectedDepartments = new Set(
      company.selectedDepartments.map((dept) => dept.department.toString())
    );

    // Step 3: Fetch Existing User Permissions or Create New Entry
    let userPermission = await Permissions.findOne({
      user: userId,
      company: companyId,
    });
    if (!userPermission) {
      userPermission = new Permissions({
        company: companyId,
        user: userId,
        deptWisePermissions: [],
      });
    }

    // Step 4: Process Each Permission Request
    for (const { departmentId, modules } of permissions) {
      if (!selectedDepartments.has(departmentId) || !Array.isArray(modules)) {
        return res.status(400).json({ error: "Invalid permission data" });
      }

      // Find or Add Department Entry
      let deptIndex = userPermission.deptWisePermissions.findIndex(
        (dept) => dept.department.toString() === departmentId
      );
      if (deptIndex === -1) {
        userPermission.deptWisePermissions.push({
          department: departmentId,
          modules: [],
        });
        deptIndex = userPermission.deptWisePermissions.length - 1;
      }

      for (const { moduleName, submodules } of modules) {
        if (!moduleName || !Array.isArray(submodules)) {
          return res.status(400).json({ error: "Invalid module data" });
        }

        // Validate module and submodules against master permissions
        const departmentPermissions = masterPermissions.find(
          (dept) => dept.departmentId === departmentId
        );
        if (!departmentPermissions)
          return res
            .status(400)
            .json({ error: "Invalid department permissions" });

        const modulePermissions = departmentPermissions.modules.find(
          (mod) => mod.name?.trim() === moduleName?.trim()
        );
        if (!modulePermissions)
          return res.status(400).json({ error: "Invalid module" });

        let moduleIndex = userPermission.deptWisePermissions[
          deptIndex
        ].modules.findIndex(
          (mod) => mod.moduleName.trim() === moduleName.trim()
        );
        if (moduleIndex === -1) {
          userPermission.deptWisePermissions[deptIndex].modules.push({
            moduleName,
            submodules: [],
          });
          moduleIndex =
            userPermission.deptWisePermissions[deptIndex].modules.length - 1;
        }

        for (const { submoduleName, actions } of submodules) {
          if (!submoduleName || !Array.isArray(actions)) {
            return res.status(400).json({ error: "Invalid submodule data" });
          }

          const submodulePermissions = modulePermissions.submodules.find(
            (sub) => sub.submoduleName?.trim() === submoduleName?.trim()
          );
          if (!submodulePermissions)
            return res.status(400).json({ error: "Invalid submodule" });

          const validActions = submodulePermissions.actions;
          const invalidActions = actions.filter(
            (action) => !validActions.includes(action)
          );
          if (invalidActions.length > 0) {
            return res
              .status(400)
              .json({ error: `Invalid actions: ${invalidActions.join(", ")}` });
          }

          let submoduleIndex = userPermission.deptWisePermissions[
            deptIndex
          ].modules[moduleIndex].submodules.findIndex(
            (sub) => sub.submoduleName === submoduleName
          );
          if (submoduleIndex === -1) {
            userPermission.deptWisePermissions[deptIndex].modules[
              moduleIndex
            ].submodules.push({ submoduleName, actions });
          } else {
            let existingActions =
              userPermission.deptWisePermissions[deptIndex].modules[moduleIndex]
                .submodules[submoduleIndex].actions;
            let newActions = [...new Set([...existingActions, ...actions])]; // Ensure no duplicates
            userPermission.deptWisePermissions[deptIndex].modules[
              moduleIndex
            ].submodules[submoduleIndex].actions = newActions;
          }
        }
      }
    }

    // Step 5: Save Updated Permissions
    const updatedUserPermission = await userPermission.save();
    if (!foundUser.permissions) {
      await UserData.findOneAndUpdate(
        { _id: userId },
        { permissions: updatedUserPermission._id }
      );
    }

    res
      .status(200)
      .json({ message: "Permissions granted successfully", userPermission });
  } catch (error) {
    next(error);
  }
};

// const revokeUserPermissions = async (req, res, next) => {
//   const logPath = "AccessLog";
//   const logAction = "Revoke User Permissions";
//   const logSourceKey = "permissions";

//   try {
//     const { userId, departmentId, moduleName, submoduleName, actions } =
//       req.body;
//     const companyId = req.company;

//     // Step 1: Validate Inputs
//     if (
//       !userId ||
//       !departmentId ||
//       !moduleName ||
//       !submoduleName ||
//       !actions ||
//       !Array.isArray(actions)
//     ) {
//       throw new CustomError(
//         "Invalid request data",
//         logPath,
//         logAction,
//         logSourceKey
//       );
//     }

//     // Step 2: Find User's Permission Entry
//     let userPermission = await Permissions.findOne({
//       user: userId,
//       company: companyId,
//     });
//     if (!userPermission) {
//       throw new CustomError(
//         "User permissions not found",
//         logPath,
//         logAction,
//         logSourceKey
//       );
//     }

//     // Step 3: Find Department Entry
//     let deptIndex = userPermission.deptWisePermissions.findIndex(
//       (dept) => dept.department.toString() === departmentId
//     );
//     if (deptIndex === -1) {
//       throw new CustomError(
//         "Department not found in user permissions",
//         logPath,
//         logAction,
//         logSourceKey
//       );
//     }

//     // Step 4: Find Module Entry
//     let moduleIndex = userPermission.deptWisePermissions[
//       deptIndex
//     ].modules.findIndex((mod) => mod.moduleName === moduleName);
//     if (moduleIndex === -1) {
//       throw new CustomError(
//         "Module not found in user permissions",
//         logPath,
//         logAction,
//         logSourceKey
//       );
//     }

//     // Step 5: Find Submodule Entry
//     let submoduleIndex = userPermission.deptWisePermissions[deptIndex].modules[
//       moduleIndex
//     ].submodules.findIndex((sub) => sub.submoduleName === submoduleName);
//     if (submoduleIndex === -1) {
//       throw new CustomError(
//         "Submodule not found in user permissions",
//         logPath,
//         logAction,
//         logSourceKey
//       );
//     }

//     // Step 6: Remove specified actions
//     let existingActions =
//       userPermission.deptWisePermissions[deptIndex].modules[moduleIndex]
//         .submodules[submoduleIndex].actions;
//     let updatedActions = existingActions.filter(
//       (action) => !actions.includes(action)
//     );

//     if (updatedActions.length === 0) {
//       // Remove the entire submodule if no actions remain
//       userPermission.deptWisePermissions[deptIndex].modules[
//         moduleIndex
//       ].submodules.splice(submoduleIndex, 1);
//     } else {
//       userPermission.deptWisePermissions[deptIndex].modules[
//         moduleIndex
//       ].submodules[submoduleIndex].actions = updatedActions;
//     }

//     // Step 7: Clean up empty structures
//     if (
//       userPermission.deptWisePermissions[deptIndex].modules[moduleIndex]
//         .submodules.length === 0
//     ) {
//       userPermission.deptWisePermissions[deptIndex].modules.splice(
//         moduleIndex,
//         1
//       );
//     }
//     if (userPermission.deptWisePermissions[deptIndex].modules.length === 0) {
//       userPermission.deptWisePermissions.splice(deptIndex, 1);
//     }

//     // Step 8: Save updated permissions
//     await userPermission.save();

//     // Log the successful revocation
//     await createLog({
//       path: logPath,
//       action: logAction,
//       remarks: "Permissions revoked successfully",
//       status: "Success",
//       user: req.user,
//       ip: req.ip,
//       company: companyId,
//       sourceKey: logSourceKey,
//       sourceId: userPermission._id,
//       changes: {
//         employee: userId,
//         revokedActions: actions,
//         moduleName,
//         submoduleName,
//         departmentId,
//       },
//     });

//     return res.status(200).json({
//       message: "Permissions revoked successfully",
//       userPermission,
//     });
//   } catch (error) {
//     next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
//   }
// };

const revokeUserPermissions = async (req, res, next) => {
  const logPath = "AccessLog";
  const logAction = "Revoke User Permissions";
  const logSourceKey = "permissions";

  try {
    const { userId, permissionsToRevoke } = req.body;
    const companyId = req.company;

    if (
      !userId ||
      !Array.isArray(permissionsToRevoke) ||
      permissionsToRevoke.length === 0
    ) {
      throw new CustomError(
        "Invalid request data",
        logPath,
        logAction,
        logSourceKey
      );
    }

    let userPermission = await Permissions.findOne({
      user: userId,
      company: companyId,
    });
    if (!userPermission) {
      throw new CustomError(
        "User permissions not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    for (const {
      departmentId,
      departmentName,
      modules,
    } of permissionsToRevoke) {
      let deptIndex = userPermission.deptWisePermissions.findIndex(
        (dept) => dept.department.toString() === departmentId
      );
      if (deptIndex === -1) continue;

      if (!modules || modules.length === 0) {
        userPermission.deptWisePermissions.splice(deptIndex, 1);
        continue;
      }

      for (const { name: moduleName, submodules } of modules) {
        let moduleIndex = userPermission.deptWisePermissions[
          deptIndex
        ].modules.findIndex((mod) => mod.moduleName === moduleName);
        if (moduleIndex === -1) continue;

        if (!submodules || submodules.length === 0) {
          userPermission.deptWisePermissions[deptIndex].modules.splice(
            moduleIndex,
            1
          );
          continue;
        }

        for (const { submoduleName, actions } of submodules) {
          let submoduleIndex = userPermission.deptWisePermissions[
            deptIndex
          ].modules[moduleIndex].submodules.findIndex(
            (sub) => sub.submoduleName === submoduleName
          );
          if (submoduleIndex === -1) continue;

          let existingActions =
            userPermission.deptWisePermissions[deptIndex].modules[moduleIndex]
              .submodules[submoduleIndex].actions;
          let updatedActions = existingActions.filter(
            (action) => !actions.includes(action)
          );

          if (updatedActions.length === 0) {
            userPermission.deptWisePermissions[deptIndex].modules[
              moduleIndex
            ].submodules.splice(submoduleIndex, 1);
          } else {
            userPermission.deptWisePermissions[deptIndex].modules[
              moduleIndex
            ].submodules[submoduleIndex].actions = updatedActions;
          }
        }

        if (
          userPermission.deptWisePermissions[deptIndex].modules[moduleIndex]
            .submodules.length === 0
        ) {
          userPermission.deptWisePermissions[deptIndex].modules.splice(
            moduleIndex,
            1
          );
        }
      }

      if (userPermission.deptWisePermissions[deptIndex].modules.length === 0) {
        userPermission.deptWisePermissions.splice(deptIndex, 1);
      }
    }

    await userPermission.save();

    const updatedPermissions = userPermission.deptWisePermissions.map(
      (dept) => ({
        departmentId: dept.department,
        departmentName: dept.departmentName,
        modules: dept.modules.map((mod) => ({
          name: mod.moduleName,
          submodules: mod.submodules.map((sub) => ({
            submoduleName: sub.submoduleName,
            actions: sub.actions,
          })),
        })),
      })
    );

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Permissions revoked successfully",
      status: "Success",
      user: req.user,
      ip: req.ip,
      company: companyId,
      sourceKey: logSourceKey,
      sourceId: userPermission._id,
      changes: { userId, revokedPermissions: permissionsToRevoke },
    });

    return res.status(200).json({
      message: "Permissions revoked successfully",
      userId,
      updatedPermissions,
    });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

module.exports = {
  userPermissions,
  grantUserPermissions,
  revokeUserPermissions,
};
