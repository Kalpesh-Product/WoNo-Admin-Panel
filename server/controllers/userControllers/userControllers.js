const Company = require("../../models/hr/Company");
const bcrypt = require("bcryptjs");
const User = require("../../models/hr/UserData");
const Role = require("../../models/roles/Roles");
const { default: mongoose } = require("mongoose");
const Department = require("../../models/Departments");
const { createLog } = require("../../utils/moduleLogs");
const CustomError = require("../../utils/customErrorlogs");

const createUser = async (req, res, next) => {
  const logPath = "hr/HrLog";
  const logAction = "Create User";
  const logSourceKey = "user";
  const { user, ip, company } = req;

  try {
    const {
      empId,
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      role,
      companyId,
      departments,
      employeeType,
      designation,
      startDate,
      workLocation,
      reportsTo,
      assetDescription,
      policies,
      homeAddress,
      bankInformation,
      panAadhaarDetails,
      payrollInformation,
      familyInformation,
    } = req.body;

    // Validate required fields
    if (
      !empId ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !companyId ||
      !employeeType ||
      !departments
    ) {
      throw new CustomError(
        "Missing required fields",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Validate departments: check for any invalid department IDs
    const invalidDepartmentIds = departments.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidDepartmentIds.length > 0) {
      throw new CustomError(
        "Invalid department Id provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Check if department exists
    const departmentExists = await Department.find({
      _id: { $in: departments },
    })
      .lean()
      .exec();
    if (!departmentExists || departmentExists.length === 0) {
      throw new CustomError(
        "Department not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Check if company exists
    const companyExists = await Company.findOne({ _id: companyId })
      .lean()
      .exec();
    if (!companyExists) {
      throw new CustomError(
        "Company not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Check if the employee ID or email is already registered
    const existingUser = await User.findOne({
      $or: [{ company: companyId, empId }, { email }],
    }).exec();
    if (existingUser) {
      throw new CustomError(
        "Employee ID or email already exists",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Check role validity
    const roleValue = await Role.findOne({ _id: role }).lean().exec();
    if (!roleValue) {
      throw new CustomError(
        "Invalid role provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Master Admin check: only one Master Admin allowed per company
    if (roleValue.roleTitle === "Master Admin") {
      const doesMasterAdminExist = await User.findOne({
        role: { $in: [roleValue._id] },
      })
        .lean()
        .exec();
      if (
        doesMasterAdminExist &&
        doesMasterAdminExist.company.toString() === companyId
      ) {
        throw new CustomError(
          "A master admin already exists",
          logPath,
          logAction,
          logSourceKey
        );
      }
    }

    const defaultPassword = "123456";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newUser = new User({
      empId,
      firstName,
      middleName,
      lastName,
      gender,
      dateOfBirth,
      phone,
      email,
      role,
      company: companyId,
      password: hashedPassword,
      departments,
      employeeType,
      designation,
      startDate,
      workLocation,
      reportsTo,
      assetDescription,
      policies,
      homeAddress,
      bankInformation,
      panAadhaarDetails,
      payrollInformation,
      familyInformation,
    });

    const savedUser = await newUser.save();

    // Log the successful user creation
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "User created successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: savedUser._id,
      changes: savedUser,
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: savedUser._id,
        empId: savedUser.empId,
        firstName: savedUser.firstName,
        middleName: savedUser.middleName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        phone: savedUser.phone,
        companyId: savedUser.company,
        role: savedUser.role,
      },
    });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const fetchUser = async (req, res, next) => {
  const { deptId } = req.params;
  const company = req.company;

  try {
    if (deptId) {
      const users = await User.find({
        department: { $elemMatch: { $eq: deptId } },
        company,
      })
        .select("-password")
        .populate([
          // { path: "reportsTo", select: "name email" },
          { path: "departments", select: "name" },
          { path: "company", select: "name" },
          { path: "role", select: "roleTitle modulePermissions" },
        ]);

      res.status(200).json(users);
    }

    const users = await User.find({ company })
      .select("-password")
      .populate([
        // { path: "reportsTo", select: "name email" },
        { path: "departments", select: "name" },
        { path: "company", select: "name" },
        { path: "role", select: "roleTitle modulePermissions" },
      ])
      .lean()
      .exec();
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const fetchSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
      .select("-password")
      .populate([
        { path: "reportsTo", select: "name email" },
        { path: "departments", select: "name" },
        { path: "company", select: "name" },
        { path: "role", select: "roleTitle modulePermissions" },
      ])
      .lean()
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User data fetched",
      user,
    });
  } catch (error) {
    console.error("Error fetching user by ID: ", error);
    res.status(500).json({ error: error.message });
  }
};

// const updateSingleUser = async (req, res) => {
//   try {
//     const { id } = req.params; // Extract user ID from request parameters
//     const updateData = req.body; // Data to update comes from the request body

//     // Define a whitelist of updatable fields, including nested objects
//     const allowedFields = [
//       "name",
//       "gender",
//       "fatherName",
//       "motherName",
//       "kycDetails.aadhaar",
//       "kycDetails.pan",
//       "bankDetails.bankName",
//       "bankDetails.accountNumber",
//       "bankDetails.ifsc",
//     ];

//     // Filter the updateData to include only allowed fields
//     const filteredUpdateData = {};

//     Object.keys(updateData).forEach((key) => {
//       if (allowedFields.includes(key)) {
//         // Direct field
//         filteredUpdateData[key] = updateData[key];
//       } else {
//         // Check for nested fields
//         const nestedFieldMatch = allowedFields.find((field) =>
//           field.startsWith(`${key}.`)
//         );
//         if (nestedFieldMatch && typeof updateData[key] === "object") {
//           // If a nested field matches, process its properties
//           const nestedFieldPrefix = `${key}.`;
//           filteredUpdateData[key] = Object.keys(updateData[key]).reduce(
//             (nestedObj, nestedKey) => {
//               if (allowedFields.includes(`${nestedFieldPrefix}${nestedKey}`)) {
//                 nestedObj[nestedKey] = updateData[key][nestedKey];
//               }
//               return nestedObj;
//             },
//             {}
//           );
//         }
//       }
//     });

//     if (Object.keys(filteredUpdateData).length === 0) {
//       return res.status(400).json({ message: "No valid fields to update" });
//     }

//     // Perform the update operation
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       { $set: filteredUpdateData }, // Use `$set` to update specific fields
//       { new: true, runValidators: true } // Return the updated document and enforce validation
//     )
//       .select("-password") // Exclude the password field
//       .populate("reportsTo", "name email")
//       .populate("departments", "name")
//       .populate("company", "name")
//       .populate("role", "roleTitle modulePermissions");

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({
//       message: "User data updated successfully",
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.error("Error updating user: ", error);
//     res.status(500).json({ error: error.message });
//   }
// };

const updateSingleUser = async (req, res, next) => {
  const { user, ip, company } = req;
  const logPath = "hr/HrLog";
  const logAction = "Update User";
  const logSourceKey = "user";

  try {
    const { id } = req.params;
    const updateData = req.body;

    // Allowed top-level fields according to new schema
    const allowedFields = ["firstName", "middleName", "lastName", "gender"];
    const filteredUpdateData = {};

    // Process top-level allowed fields
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field];
      }
    });

    // Process nested fields for familyInformation (fatherName, motherName)
    if (
      updateData.familyInformation &&
      typeof updateData.familyInformation === "object"
    ) {
      const allowedFamilyFields = ["fatherName", "motherName"];
      filteredUpdateData.familyInformation = {};
      allowedFamilyFields.forEach((field) => {
        if (updateData.familyInformation[field] !== undefined) {
          filteredUpdateData.familyInformation[field] =
            updateData.familyInformation[field];
        }
      });
      if (Object.keys(filteredUpdateData.familyInformation).length === 0) {
        delete filteredUpdateData.familyInformation;
      }
    }

    // Process nested fields for panAadhaarDetails (aadhaarId, pan)
    if (
      updateData.panAadhaarDetails &&
      typeof updateData.panAadhaarDetails === "object"
    ) {
      const allowedPanFields = ["aadhaarId", "pan"];
      filteredUpdateData.panAadhaarDetails = {};
      allowedPanFields.forEach((field) => {
        if (updateData.panAadhaarDetails[field] !== undefined) {
          filteredUpdateData.panAadhaarDetails[field] =
            updateData.panAadhaarDetails[field];
        }
      });
      if (Object.keys(filteredUpdateData.panAadhaarDetails).length === 0) {
        delete filteredUpdateData.panAadhaarDetails;
      }
    }

    // Process nested fields for bankInformation (bankName, accountNumber, bankIFSC)
    if (
      updateData.bankInformation &&
      typeof updateData.bankInformation === "object"
    ) {
      const allowedBankFields = ["bankName", "accountNumber", "bankIFSC"];
      filteredUpdateData.bankInformation = {};
      allowedBankFields.forEach((field) => {
        if (updateData.bankInformation[field] !== undefined) {
          filteredUpdateData.bankInformation[field] =
            updateData.bankInformation[field];
        }
      });
      if (Object.keys(filteredUpdateData.bankInformation).length === 0) {
        delete filteredUpdateData.bankInformation;
      }
    }

    // If there's nothing to update, throw error
    if (Object.keys(filteredUpdateData).length === 0) {
      throw new CustomError(
        "No valid fields to update",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Perform the update operation
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { $set: filteredUpdateData },
      { new: true, runValidators: true }
    )
      .select("-password")
      .populate("reportsTo", "firstName lastName email")
      .populate("departments", "name")
      .populate("company", "name")
      .populate("role", "roleTitle modulePermissions");

    if (!updatedUser) {
      throw new CustomError("User not found", logPath, logAction, logSourceKey);
    }

    // Log success for user update
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "User data updated successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedUser._id,
      changes: filteredUpdateData,
    });

    return res.status(200).json({
      message: "User data updated successfully",
    });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

module.exports = { createUser, fetchUser, fetchSingleUser, updateSingleUser };
