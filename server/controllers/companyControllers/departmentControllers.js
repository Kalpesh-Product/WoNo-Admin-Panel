const Department = require("../../models/Departments");
const User = require("../../models/UserData");
const { createLog } = require("../../utils/moduleLogs");

const createDepartment = async (req, res, next) => {
  const { deptId, deptName } = req.body;
  const user = req.user;
  const ip = req.ip;
  const company = req.company;
  let path = "CompanyLogs";
  let action = "Create Department";

  try {
    if (!deptId || !deptName) {
      await createLog(path, action, "Invalid department details", "Failed", user, ip, company);
      return res.status(400).json({ message: "Invalid department details" });
    }

    const deptExists = await Department.findOne({ departmentId: deptId })
      .lean()
      .exec();

    if (deptExists) {
      await createLog(path, action, "Department already exists", "Failed", user, ip, company);
      return res.status(400).json({ message: "Department already exists" });
    }

    const newDept = new Department({
      departmentId: deptId,
      name: deptName,
    });

    await newDept.save();

    // Log the successful department creation
    await createLog(path, action, "New department created", "Success", user, ip, company, newDept._id, { deptId, deptName });

    res.status(201).json({ message: "New department created" });
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
    const { user } = req;  // Logged-in user
    const path = "CompanyLogs";
    const action = "Assign Admin";

    // Validate the user reference
    const admin = await User.findById(adminId);
    if (!admin) {
      await createLog(path, action, "User not found", "Failed", user, req.ip, req.company);
      return res.status(404).json({ message: "User not found" });
    }

    // Validate the department reference
    const department = await Department.findById(departmentId);
    if (!department) {
      await createLog(path, action, "Department not found", "Failed", user, req.ip, req.company);
      return res.status(404).json({ message: "Department not found" });
    }

    // Update the department's admin field
    department.admin = admin._id;
    const updatedDepartment = await department.save();

    await createLog(path, action, "Admin assigned successfully", "Success", user, req.ip, req.company, updatedDepartment._id, updatedDepartment);

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
