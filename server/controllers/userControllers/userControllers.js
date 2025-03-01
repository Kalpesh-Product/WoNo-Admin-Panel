const Company = require("../../models/hr/Company");
const bcrypt = require("bcryptjs");
const User = require("../../models/hr/UserData");
const Role = require("../../models/roles/Roles");
const { default: mongoose } = require("mongoose");
const Department = require("../../models/Departments");
const { createLog } = require("../../utils/moduleLogs");
const csvParser = require("csv-parser");
const { Readable } = require("stream");

const createUser = async (req, res, next) => {
  const logPath = "hr/HrLog";
  const logAction = "Create User";
  const logSourceKey = "user";
  const { user, ip, company } = req;

  try {
    const {
      empId,
      name,
      gender,
      email,
      phone,
      role,
      companyId,
      departments,
      employeeType,
    } = req.body;

    // Validate required fields
    if (
      !empId ||
      !name ||
      !email ||
      !phone ||
      !companyId ||
      !employeeType ||
      !departments
    ) {
      await createLog(
        path,
        action,
        "Missing required fields",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate departments: check for any invalid department IDs
    const invalidDepartmentIds = departments.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidDepartmentIds.length > 0) {
      await createLog(
        path,
        action,
        "Invalid department ID provided",
        "Failed",
        user,
        ip,
        company
      );
      return res
        .status(400)
        .json({ message: "Invalid department Id provided" });
    }

    const departmentExists = await Department.find({
      _id: { $in: departments },
    })
      .lean()
      .exec();
    if (!departmentExists || departmentExists.length === 0) {
      await createLog(
        path,
        action,
        "Department not found",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if company exists
    const companyExists = await Company.findOne({ _id: companyId })
      .lean()
      .exec();
    if (!companyExists) {
      await createLog(
        path,
        action,
        "Company not found",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the employee ID or email is already registered
    const existingUser = await User.findOne({
      $or: [{ company, empId }, { email }],
    }).exec();
    if (existingUser) {
      await createLog(
        path,
        action,
        "Employee ID or email already exists",
        "Failed",
        user,
        ip,
        company
      );
      return res
        .status(409)
        .json({ message: "Employee ID or email already exists" });
    }

    // Check role validity
    const roleValue = await Role.findOne({ _id: role }).lean().exec();
    if (!roleValue) {
      await createLog(
        path,
        action,
        "Invalid role provided",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Invalid role provided" });
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
        await createLog(
          path,
          action,
          "A master admin already exists",
          "Failed",
          user,
          ip,
          company
        );
        return res
          .status(400)
          .json({ message: "A master admin already exists" });
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
    });

    const savedUser = await newUser.save();

    // Success log for user creation
    await createLog(
      path,
      action,
      "User created successfully",
      "Success",
      user,
      ip,
      company,
      savedUser._id,
      {
        empId: savedUser.empId,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.role,
        companyId: savedUser.company,
      }
    );

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
    "Error fetching users : ", error;
    res.status(500).json({ error: error.message });
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
      await createLog(
        logPath,
        logAction,
        "No valid fields to update",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "No valid fields to update" });
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
      await createLog(
        logPath,
        logAction,
        "User not found",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(404).json({ message: "User not found" });
    }

    await createLog(
      logPath,
      logAction,
      "User data updated successfully",
      "Success",
      user,
      ip,
      company,
      updatedUser._id,
      filteredUpdateData
    );

    return res.status(200).json({
      message: "User data updated successfully",
    });
  } catch (error) {
    await createLog(
      logPath,
      logAction,
      "Error updating user",
      "Failed",
      user,
      ip,
      company,
      { error: error.message }
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

const bulkInsertUsers = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const companyId = req.company;
    const foundCompany = await Company.findById(companyId)
      .select("selectedDepartments")
      .populate({
        path: "selectedDepartments.department",
        select: "_id departmentId",
      })
      .lean()
      .exec();

    if (!foundCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    const departmentMap = new Map(
      foundCompany.selectedDepartments.map((dep) => [
        dep.department.departmentId,
        dep.department._id,
      ])
    );

    const roles = await Role.find();
    const roleMap = new Map(roles.map((role) => [role.roleID, role._id]));

    const newUsers = [];
    const hashedPassword = await bcrypt.hash("123456", 10);
    const stream = Readable.from(req.file.buffer.toString("utf-8").trim());

    stream
      .pipe(csvParser())
      .on("data", async (row) => {
        try {
          const departmentIds = row["Departments"]
            ? row["Departments"].split("/").map((d) => d.trim())
            : [];

          const departmentObjectIds = departmentIds.map((id) => {
            if (!departmentMap.has(id)) {
              throw new Error(`Invalid department: ${id}`);
            }
            return departmentMap.get(id);
          });

          const roleIds = row["Roles"]
            ? row["Roles"].split("/").map((r) => r.trim())
            : [];
          const roleObjectIds = roleIds
            .map((id) => roleMap.get(id))
            .filter(Boolean);

          let reportsToId = row["Reports To"]
            ? roleMap.get(row["Reports To"].trim())
            : null;

          const user = {
            empId: row["Emp ID"],
            firstName: row["First Name"],
            middleName: row["Middle Name (optional)"] || "",
            lastName: row["Last Name"],
            gender: row["Gender"],
            dateOfBirth: new Date(row["Date Of Birth"]),
            phone: row["Phone Number"],
            email: row["Company Email"],
            company: new mongoose.Types.ObjectId(companyId),
            password: hashedPassword,
            isActive: Boolean(row["isActive"]) || false,

            departments: departmentObjectIds,
            role: roleObjectIds,
            reportsTo: reportsToId,

            employeeType: {
              name: row["Employement Type"] || "Full-Time",
              leavesCount: [
                { leaveType: "Privileged", count: row["Privileged"] || "0" },
                { leaveType: "Sick", count: row["Sick"] || "0" },
              ],
            },

            designation: row["Designation"],
            startDate: new Date(row["Date Of Joining"]),
            workLocation: row["Work Building"],

            policies: {
              shift: row["Shift Policy"] || "General",
              workSchedulePolicy: row["Work Schedule Policy"] || "",
              leavePolicy: row["Leave Policy"] || "",
              holidayPolicy: row["Holiday Policy"] || "",
            },

            homeAddress: {
              addressLine1: row["Address"] || "",
              addressLine2: row["Present Address"] || "",
              city: row["City"] || "",
              state: row["State"] || "",
              pinCode: row["PIN Code"] || "",
            },

            bankInformation: {
              bankIFSC: row["Bank IFSC"] || "",
              bankName: row["Bank Name"] || "",
              branchName: row["Branch Name"] || "",
              nameOnAccount: row["Account Name"] || "",
              accountNumber: row["Account Number"] || "",
            },

            panAadhaarDetails: {
              aadhaarId: row["Aadhaar Number"] || "",
              pan: row["PAN Card Number"] || "",
              pfAccountNumber: row["PF Account Number"] || "",
              pfUAN: row["PF UAN"] || "",
              esiAccountNumber: row["ESI Account Number"] || "",
            },

            payrollInformation: {
              includeInPayroll: row["Include In Payroll (Yes/No)"] === "Yes",
              professionTaxExemption: row["Profession Tax Exemption"] === "Yes",
              includePF: row["Include PF"] === "Yes",
              pfContributionRate: parseFloat(row["Employer PF Contri"] || "0"),
              employeePF: parseFloat(row["Employee PF"] || "0"),
            },

            familyInformation: {
              fatherName: row["Father's Name"] || "",
              motherName: row["Mother's Name"] || "",
              maritalStatus: row["Martial Status"] || "Single",
            },
          };

          newUsers.push(user);
        } catch (error) {
          next(error)
        }
      })
      .on("end", async () => {
        try {
          if (newUsers.length === 0) {
            return res
              .status(400)
              .json({ message: "No valid data found in CSV" });
          }
          await User.insertMany(newUsers);
          res.status(201).json({
            message: "Bulk data inserted successfully",
            insertedCount: newUsers.length,
          });
        } catch (error) {
          res.status(500).json({ message: "Error inserting data", error });
        }
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  fetchUser,
  fetchSingleUser,
  updateSingleUser,
  bulkInsertUsers,
};
