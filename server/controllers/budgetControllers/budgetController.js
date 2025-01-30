const Budget = require("../../models/Budget");
const User = require("../../models/UserData");
const Company = require("../../models/Company");

const requestBudget = async (req, res, next) => {
  try {
    const { expanseName, amount, date } = req.body;
    const userId = req.user;

    if (!expanseName || !amount || !date) {
      return res
        .status(400)
        .json({ message: "Invalid budget details provided" });
    }

    // Find the current user and populate role, company, and department
    const currentUser = await User.findById(userId)
      .select("role company department")
      .populate([
        {
          path: "role",
          select: "roleTitle",
        },
        {
          path: "department",
          select: "name",
        },
      ])
      .lean()
      .exec();

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the company and its selected departments
    const currentUserCompany = await Company.findById(currentUser.company)
      .select("selectedDepartments")
      .populate({
        path: "selectedDepartments.department",
        select: "name",
      })
      .lean()
      .exec();

    if (!currentUserCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if the user is an admin in any department
    let adminDepartments = [];

    for (let dept of currentUserCompany.selectedDepartments) {
      if (
        dept.admin.some((adminId) => adminId.toString() === userId.toString())
      ) {
        adminDepartments.push(dept.department._id);
      }
    }

    if (adminDepartments.length === 0) {
      return res
        .status(403)
        .json({ message: "User is not an admin in any department" });
    }

    // Create a new budget request for the admin's department(s)
    let newBudgets = [];

    for (let deptId of adminDepartments) {
      let newBudget = new Budget({
        expanseName,
        amount,
        dueDate: date,
        department: deptId,
        company: currentUser.company,
      });

      await newBudget.save();
      newBudgets.push(newBudget);
    }

    return res
      .status(201)
      .json({
        message: "New budget requested successfully",
        budgets: newBudgets,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = requestBudget;
