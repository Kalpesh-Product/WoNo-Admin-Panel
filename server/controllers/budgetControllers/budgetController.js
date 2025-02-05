const Budget = require("../../models/Budget");
const User = require("../../models/UserData");
const Company = require("../../models/Company");

const requestBudget = async (req, res, next) => {
  try {
    const { amount, dueDate, expanseName } = req.body;
    const user = req.user;
    const { departmentId } = req.params;

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(401).json({ message: "unauthorized" });
    }

    if (!amount || !dueDate || !expanseName) {
      return res.status(400).json({ message: "Invalid budget data" });
    }

    const company = await Company.findOne({ _id: foundUser.company })
      .select("selectedDepartments")
      .populate([{ path: "selectedDepartments.department", select: "name" }])
      .lean()
      .exec();

    if (!company) {
      return res.status(404).json({ message: "company not found" });
    }

    const departmentExists = company.selectedDepartments.find(
      (dept) => dept.department._id.toString() === departmentId
    );

    if (!departmentExists) {
      res
        .status(400)
        .json({ message: "You haven't selected the this department" });
    }

    const newBudgetRequest = new Budget({
      expanseName,
      department: departmentId,
      company: company._id,
      dueDate,
      amount,
    });

    await newBudgetRequest.save();
    return res.status(200).json({
      message: `budget requested for ${departmentExists.department.name}`,
    });
  } catch (error) {
    next(error);
  }
};

const fetchBudget = async (req, res, next) => {
  try {
    const departmentId = req.params;
    const user = req.user;

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .populate([{ path: "company", select: "companyName" }])
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(400).json({ message: "No user found" });
    }

    const allBudgets = await Budget.find({ company: foundUser.company })
      .lean()
      .exec();

    res.status(200).json({ allBudgets });
  } catch (error) {
    next(error);
  }
};

module.exports = { requestBudget, fetchBudget };
