const Permissions = require("../../models/Permissions");
const masterPermissions = require("../../config/masterPermissions");
const Company = require("../../models/hr/Company");

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

    // 🔥 Fix: If user has no permissions, still return all available ones
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
              availableActions: sub.actions, // 🔥 All actions are available
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
    const { userId, departmentId, moduleName, submoduleName, actions } =
      req.body;

    const companyId = req.company;

    // Step 1: Validate Inputs
    if (
      !userId ||
      !companyId ||
      !departmentId ||
      !moduleName ||
      !submoduleName ||
      !actions ||
      !Array.isArray(actions)
    ) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Step 2: Validate if department is part of the company's selected departments
    const company = await Company.findById(companyId).populate(
      "selectedDepartments"
    );
    if (!company) return res.status(404).json({ error: "Company not found" });

    const selectedDepartments = company.selectedDepartments.map((dept) =>
      dept.department.toString()
    );
    if (!selectedDepartments.includes(departmentId)) {
      return res
        .status(400)
        .json({ error: "Invalid department for this company" });
    }

    // Step 3: Validate if module, submodule, and actions exist in master permissions
    const departmentPermissions = masterPermissions.find(
      (dept) => dept.departmentId === departmentId
    );
    if (!departmentPermissions) {
      return res.status(400).json({ error: "Invalid department permissions" });
    }

    const modulePermissions = departmentPermissions.modules.find(
      (mod) => mod.name?.trim() === moduleName?.trim()
    );

    if (!modulePermissions) {
      return res.status(400).json({ error: "Invalid module" });
    }

    const submodulePermissions = modulePermissions.submodules.find(
      (sub) => sub.submoduleName?.trim() === submoduleName?.trim()
    );
    if (!submodulePermissions) {
      return res.status(400).json({ error: "Invalid submodule" });
    }

    // Ensure actions are valid
    const validActions = submodulePermissions.actions;
    const invalidActions = actions.filter(
      (action) => !validActions.includes(action)
    );
    if (invalidActions.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid actions: ${invalidActions.join(", ")}` });
    }

    // Step 4: Find or Create User's Permission Entry
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

    // Step 5: Find or Add Department Entry
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

    // Step 6: Find or Add Module Entry
    let moduleIndex = userPermission.deptWisePermissions[
      deptIndex
    ].modules.findIndex((mod) => mod.name.trim() === moduleName.trim());

    if (moduleIndex === -1) {
      userPermission.deptWisePermissions[deptIndex].modules.push({
        moduleName,
        submodules: [],
      });
      moduleIndex =
        userPermission.deptWisePermissions[deptIndex].modules.length - 1;
    }

    // Step 7: Find or Add Submodule Entry
    let submoduleIndex = userPermission.deptWisePermissions[deptIndex].modules[
      moduleIndex
    ].submodules.findIndex((sub) => sub.submoduleName === submoduleName);

    if (submoduleIndex === -1) {
      userPermission.deptWisePermissions[deptIndex].modules[
        moduleIndex
      ].submodules.push({
        submoduleName,
        actions,
      });
    } else {
      // Merge granted actions with existing actions
      let existingActions =
        userPermission.deptWisePermissions[deptIndex].modules[moduleIndex]
          .submodules[submoduleIndex].actions;
      let newActions = [...new Set([...existingActions, ...actions])]; // Ensure no duplicates

      userPermission.deptWisePermissions[deptIndex].modules[
        moduleIndex
      ].submodules[submoduleIndex].actions = newActions;
    }

    // Step 8: Save Updated Permissions
    await userPermission.save();

    res
      .status(200)
      .json({ message: "Permissions granted successfully", userPermission });
  } catch (error) {
    next(error);
  }
};

module.exports = { userPermissions, grantUserPermissions };
