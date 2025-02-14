const Company = require("../../models/Company");
const bcrypt = require("bcryptjs");
const User = require("../../models/UserData"); 
const Role = require("../../models/Roles");
const { default: mongoose } = require("mongoose");
const Department = require("../../models/Departments");
 

const createUser = async (req, res, next) => {
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
      return res.status(400).json({ message: "Missing required fields" });
    }

    const invalidDepartmentIds = departments.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidDepartmentIds.length > 0) {
      return res.status(400).json({ message: "Invalid department Id provided" });
    }

    // Check if department exists
    const departmentExists = await Department.find({
      _id: { $in: departments },
    })
      .lean()
      .exec();

    if (!departmentExists || departmentExists.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if company exists
    const company = await Company.findOne({ _id: companyId }).lean().exec();
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the employee ID or email is already registered
    const existingUser = await User.findOne({
      $or: [{ company: companyId, empId }, { email }],
    }).exec();
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Employee ID or email already exists" });
    }

    // Check role validity
    const roleValue = await Role.findOne({ _id: role }).lean().exec();
    if (!roleValue) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // Master Admin check
    if (roleValue.roleTitle === "Master Admin") {
      const doesMasterAdminExists = await User.findOne({
        role: { $in: [roleValue._id] },
      })
        .lean()
        .exec();
      if (
        doesMasterAdminExists &&
        doesMasterAdminExists.company.toString() === companyId
      ) {
        return res
          .status(400)
          .json({ message: "A master admin already exists" });
      }
    }

    // Hash password
    const defaultPassword = "123456"; // Use a more secure default in production
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create user object with all provided fields
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

    // Save the user
    const savedUser = await newUser.save();

    // Send response
    res.status(201).json({
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
    console.error("Error creating user:", error.message);
    next(error);
  }
};


const fetchUser = async (req, res) => {
  const { deptId } = req.params;
  try {
    if (deptId) {
      const users = await User.find({
        department: { $elemMatch: { $eq: deptId } },
      })
        .select("-password")
        .populate([
          // { path: "reportsTo", select: "name email" },
          { path: "departments", select: "name" },
          { path: "company", select: "name" },
          { path: "role", select: "roleTitle modulePermissions" },
        ]);
      res.status(200).json({
        message: "Users data fetched",
        users,
      });
    }
    const users = await User.find()
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
    ("Error fetching users : ", error);
    res.status(500).json({ error: error.message });
  }
};

const fetchSingleUser = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from request parameters
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

// const updateSingleUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     // Define allowed top-level fields
//     const allowedFields = ["name", "gender", "fatherName", "motherName"];

//     // Initialize an object to hold the validated data
//     const filteredUpdateData = {};

//     // Process top-level allowed fields
//     allowedFields.forEach((field) => {
//       if (updateData[field] !== undefined) {
//         filteredUpdateData[field] = updateData[field];
//       }
//     });

//     // Process nested fields for kycDetails
//     if (updateData.kycDetails && typeof updateData.kycDetails === "object") {
//       const allowedKycFields = ["aadhaar", "pan"];
//       filteredUpdateData.kycDetails = {};

//       allowedKycFields.forEach((field) => {
//         if (updateData.kycDetails[field] !== undefined) {
//           filteredUpdateData.kycDetails[field] = updateData.kycDetails[field];
//         }
//       });

//       // Remove kycDetails if no allowed fields were added
//       if (Object.keys(filteredUpdateData.kycDetails).length === 0) {
//         delete filteredUpdateData.kycDetails;
//       }
//     }

//     // Process nested fields for bankDetails
//     if (updateData.bankDetails && typeof updateData.bankDetails === "object") {
//       const allowedBankFields = ["bankName", "accountNumber", "ifsc"];
//       filteredUpdateData.bankDetails = {};

//       allowedBankFields.forEach((field) => {
//         if (updateData.bankDetails[field] !== undefined) {
//           filteredUpdateData.bankDetails[field] = updateData.bankDetails[field];
//         }
//       });

//       // Remove bankDetails if no allowed fields were added
//       if (Object.keys(filteredUpdateData.bankDetails).length === 0) {
//         delete filteredUpdateData.bankDetails;
//       }
//     }

//     // If there's nothing to update, return an error response
//     if (Object.keys(filteredUpdateData).length === 0) {
//       return res.status(400).json({ message: "No valid fields to update" });
//     }
 
//     // Perform the update operation
//     const updatedUser = await User.findByIdAndUpdate(
//      { _id:id},
//       { $set: filteredUpdateData },
//       { new: true }
//     )
//       .select("-password")
//       .populate("reportsTo", "name email")
//       .populate("departments", "name")
//       .populate("company", "name")
//       .populate("role", "roleTitle modulePermissions");

//       console.log(updatedUser)
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
    if (updateData.familyInformation && typeof updateData.familyInformation === "object") {
      const allowedFamilyFields = ["fatherName", "motherName"];
      filteredUpdateData.familyInformation = {};
      allowedFamilyFields.forEach((field) => {
        if (updateData.familyInformation[field] !== undefined) {
          filteredUpdateData.familyInformation[field] = updateData.familyInformation[field];
        }
      });
      if (Object.keys(filteredUpdateData.familyInformation).length === 0) {
        delete filteredUpdateData.familyInformation;
      }
    }

    // Process nested fields for panAadhaarDetails (aadhaarId, pan)
    if (updateData.panAadhaarDetails && typeof updateData.panAadhaarDetails === "object") {
      const allowedPanFields = ["aadhaarId", "pan"];
      filteredUpdateData.panAadhaarDetails = {};
      allowedPanFields.forEach((field) => {
        if (updateData.panAadhaarDetails[field] !== undefined) {
          filteredUpdateData.panAadhaarDetails[field] = updateData.panAadhaarDetails[field];
        }
      });
      if (Object.keys(filteredUpdateData.panAadhaarDetails).length === 0) {
        delete filteredUpdateData.panAadhaarDetails;
      }
    }

    // Process nested fields for bankInformation (bankName, accountNumber, bankIFSC)
    if (updateData.bankInformation && typeof updateData.bankInformation === "object") {
      const allowedBankFields = ["bankName", "accountNumber", "bankIFSC"];
      filteredUpdateData.bankInformation = {};
      allowedBankFields.forEach((field) => {
        if (updateData.bankInformation[field] !== undefined) {
          filteredUpdateData.bankInformation[field] = updateData.bankInformation[field];
        }
      });
      if (Object.keys(filteredUpdateData.bankInformation).length === 0) {
        delete filteredUpdateData.bankInformation;
      }
    }

    // If there's nothing to update, return an error response
    if (Object.keys(filteredUpdateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Perform the update operation using the id directly
  
    const updatedUser = await User.findByIdAndUpdate(
     { _id:id},
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select("-password")
      .populate("reportsTo", "firstName lastName email")
      .populate("departments", "name")
      .populate("company", "name")
      .populate("role", "roleTitle modulePermissions");
 
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User data updated successfully"
    });
  } catch (error) {
    next(error)
  }
};



module.exports = { createUser, fetchUser, fetchSingleUser, updateSingleUser };
