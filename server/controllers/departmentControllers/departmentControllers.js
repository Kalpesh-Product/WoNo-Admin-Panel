const Department = require("../../models/Departments");
const CompanyData = require("../../models/CompanyData")
const User = require("../../models/User")

const addDepartment = async (req, res, next) => {
  try {
    const { name, company } = req.body;

    console.log("Request Payload:", { name, company });

    // Find the company using the companyId
    const companyDoc = await CompanyData.findById(company);
    console.log("Company Found:", companyDoc);

    if (!companyDoc) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Generate a unique departmentId based on the number of existing departments
    const departmentCount = await Department.countDocuments();
    const departmentId = `DEP${String(departmentCount + 1).padStart(5, "0")}`;

    // Create the department
    const department = new Department({
      departmentId,
      name,
      company
    });

    const savedDepartment = await department.save();
    res.status(201).json({
      message: "Department added successfully",
      department: savedDepartment,
    });
  } catch (error) {
    console.error("Error adding department:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
    res.status(500).json({ error: "Internal Server Error" });
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

module.exports = { addDepartment, assignAdmin, getDepartments };
