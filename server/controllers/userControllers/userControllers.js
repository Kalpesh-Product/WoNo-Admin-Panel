const CompanyData = require("../../models/CompanyData");
const Department = require("../../models/Departments");
const User = require("../../models/User");

const mongoose = require("mongoose");

const createUser = async (req, res, next) => {
  try {
    const {
      empId,
      name,
      gender,
      dob,
      email,
      phone,
      role = "masterAdmin",
      department,
      designation,
      fatherName,
      motherName,
      fatherOccupation,
      motherOccupation,
      maritalStatus,
      spouseName,
      spouseOccupation,
      reportsTo,
      address = {},
      kycDetails = {},
      bankDetails = {},
      selectedServices = [],
      workLocation = "",
      workType = "",
      employeeType = "",
      startDate = null,
      shift = "",
      workPolicy = "",
      attendanceSource = "TimeClock",
      pfAccountNumber = "",
      esiAccountNumber = "",
      assignedAsset = [],
      assignedMembers = [],
      companyId,
    } = req.body;

    // Validate the company using _id
    const company = await CompanyData.findOne({ companyId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Validate the department
    if (!department) {
      return res.status(400).json({ message: "Department is required" });
    }

    const departmentArray = Array.isArray(department)
      ? department
      : [department];

    // Validate each department ID
    const departmentIds = await Promise.all(
      departmentArray.map(async (depId) => {
        if (!mongoose.Types.ObjectId.isValid(depId)) {
          throw new Error(`Invalid department ID: ${depId}`);
        }
        const foundDepartment = await Department.findById(depId);
        if (!foundDepartment) {
          throw new Error(`Department not found for ID: ${depId}`);
        }
        return foundDepartment._id;
      })
    );

    // Validate reportsTo field
    let reportsToId = null;
    if (reportsTo) {
      if (!mongoose.Types.ObjectId.isValid(reportsTo)) {
        return res.status(400).json({ message: "Invalid reportsTo ID" });
      }
      const reportingUser = await User.findById(reportsTo);
      if (!reportingUser) {
        return res.status(404).json({ message: "Reporting user not found" });
      }
      reportsToId = reportingUser._id;
    }

    // Generate default password and hash it
    const defaultPassword = "123";
    // const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create the user
    const user = new User({
      empId,
      name,
      gender,
      dob,
      email,
      phone,
      role,
      department: departmentIds,
      designation,
      fatherName,
      motherName,
      fatherOccupation,
      motherOccupation,
      maritalStatus,
      spouseName,
      spouseOccupation,
      reportsTo: reportsToId,
      address,
      kycDetails,
      bankDetails,
      selectedServices,
      workLocation,
      workType,
      employeeType,
      startDate,
      shift,
      workPolicy,
      attendanceSource,
      pfAccountNumber,
      esiAccountNumber,
      assignedAsset,
      assignedMembers,
      company: company._id,
      password: defaultPassword, // Store hashed password
    });

    // Save the user
    const savedUser = await user.save();

    res.status(201).json({
      message: "User added successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error adding user:", error.message);
    next(error);
  }
};

const fetchUser = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("reportsTo", "name email")
      .populate("department", "name")
      .populate("company", "name")
      .populate("role", "roleTitle modulePermissions");
    res.status(200).json({
      message: "Users data fetched",
      users,
    });
  } catch (error) {
    console.log("Error fetching users : ", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, fetchUser };
