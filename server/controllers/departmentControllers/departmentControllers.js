const Department = require("../../models/Departments");
const CompanyData = require("../../models/CompanyData");
const User = require("../../models/User");

const createDepartment = async (req, res, next) => {
  try {
    const { deptId, deptName } = req.body;
    if (!deptId || !deptName) {
      return res.status(400).json({ message: "Invalid department details" });
    }

    const deptExists = await Department.findOne({ departmentId: deptId })
      .lean()
      .exec();

    if (deptExists) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const newDept = new Department({
      departmentId: deptId,
      name: deptName,
    });

    await newDept.save();
    res.status(201).json({ message: "new department created" });
  } catch (error) {
    next(error);
  }
};

const getDepartments = async (req, res, next) => {
  try {
    // Fetch all departments
    const departments = await Department.find()
      .populate("company", "companyName") // Populate company reference with selected fields
      .populate("admin", "name email") // Populate admin reference with selected fields
      .populate("designations", "title responsibilities") // Populate admin reference with selected fields
      .exec();

    res.status(200).json({
      message: "Departments fetched successfully",
      departments,
    });
  } catch (error) {
    console.error("Error fetching departments:", error);
    next(error);
  }
};

const assignAdmin = async (req, res, next) => {
  try {
    const { departmentId, adminId } = req.body;

    // Validate the user reference
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the department reference
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Update the department's admin field
    department.admin = admin._id;
    const updatedDepartment = await department.save();

    res.status(200).json({
      message: "Admin assigned successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("Error assigning admin:", error);
    next(error);
  }
};

module.exports = { createDepartment, assignAdmin, getDepartments };
