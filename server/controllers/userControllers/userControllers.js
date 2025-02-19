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
      return res.status(400).json({ message: "Missing required fields" });
    }

    const invalidDepartmentIds = departments.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidDepartmentIds.length > 0) {
      return res
        .status(400)
        .json({ message: "Invalid department Id provided" });
    }

    // Check if department exists
    const departmentExists = await Department.find({
      _id: { $in: departments },
    })
      .lean()
      .exec();

    if (!departmentExists) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if company exists
    const company = await Company.findOne({ _id: companyId }).lean().exec();
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the employee ID or email is already registered
    const existingUser = await User.findOne({
      $or: [{ company, empId }, { email }],
    }).exec();
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Employee ID or email already exists" });
    }

    const roleValue = await Role.findOne({ _id: role }).lean().exec();
    if (!roleValue) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    let newUser;
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
          .json({ message: "a master admin already exists" });
      }
    }

    // Hash password
    const defaultPassword = "123456"; // Use a better default or generate one securely
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create user object
    newUser = new User({
      empId,
      name,
      gender,
      email,
      phone,
      role,
      company: companyId,
      password: hashedPassword,
      departments,
      employeeType,
    });

    // Save the user
    const savedUser = await newUser.save();

    // Send response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: savedUser._id,
        empId: savedUser.empId,
        name: savedUser.name,
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
    "Error fetching users : ", error;
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

const updateSingleUser = async (req, res) => {
  try {
    const { id } = req.params; // Extract user ID from request parameters
    const updateData = req.body; // Data to update comes from the request body

    // Define a whitelist of updatable fields, including nested objects
    const allowedFields = [
      "name",
      "gender",
      "fatherName",
      "motherName",
      "kycDetails.aadhaar",
      "kycDetails.pan",
      "bankDetails.bankName",
      "bankDetails.accountNumber",
      "bankDetails.ifsc",
    ];

    // Filter the updateData to include only allowed fields
    const filteredUpdateData = {};

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        // Direct field
        filteredUpdateData[key] = updateData[key];
      } else {
        // Check for nested fields
        const nestedFieldMatch = allowedFields.find((field) =>
          field.startsWith(`${key}.`)
        );
        if (nestedFieldMatch && typeof updateData[key] === "object") {
          // If a nested field matches, process its properties
          const nestedFieldPrefix = `${key}.`;
          filteredUpdateData[key] = Object.keys(updateData[key]).reduce(
            (nestedObj, nestedKey) => {
              if (allowedFields.includes(`${nestedFieldPrefix}${nestedKey}`)) {
                nestedObj[nestedKey] = updateData[key][nestedKey];
              }
              return nestedObj;
            },
            {}
          );
        }
      }
    });

    if (Object.keys(filteredUpdateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // Perform the update operation
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: filteredUpdateData }, // Use `$set` to update specific fields
      { new: true, runValidators: true } // Return the updated document and enforce validation
    )
      .select("-password") // Exclude the password field
      .populate("reportsTo", "name email")
      .populate("department", "name")
      .populate("company", "name")
      .populate("role", "roleTitle modulePermissions");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User data updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ error: error.message });
  }
};

const bulkInsertUsers=async(req,res,next)=>{
  try {
    
  } catch (error) {
    next(error)
  }
}

module.exports = { createUser, fetchUser, fetchSingleUser, updateSingleUser };
