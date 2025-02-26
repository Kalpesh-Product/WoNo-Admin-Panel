const Budget = require("../../models/hr/Budget");
const User = require("../../models/hr/UserData");
const Company = require("../../models/Company");
const CustomError = require("../../utils/customErrorlogs");
const { createLog } = require("../../utils/moduleLogs");

const requestBudget = async (req, res, next) => {
  const logPath = "BudgetLogs";
  const logAction = "Request Budget";
  const logSourceKey = "budget";
  const { user, ip, company } = req;

  try {
    const { amount, dueDate, expanseName } = req.body;
    const { departmentId } = req.params;

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .lean()
      .exec();
    if (!foundUser) {
      throw new CustomError("Unauthorized", logPath, logAction, logSourceKey);
    }
    if (!amount || !dueDate || !expanseName) {
      throw new CustomError(
        "Invalid budget data",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const companyDoc = await Company.findOne({ _id: foundUser.company })
      .select("selectedDepartments")
      .populate([{ path: "selectedDepartments.department", select: "name" }])
      .lean()
      .exec();
    if (!companyDoc) {
      throw new CustomError(
        "Company not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const departmentExists = companyDoc.selectedDepartments.find(
      (dept) => dept.department._id.toString() === departmentId
    );
    if (!departmentExists) {
      throw new CustomError(
        "You haven't selected this department",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const newBudgetRequest = new Budget({
      expanseName,
      department: departmentId,
      company: companyDoc._id,
      dueDate,
      amount,
    });

    await newBudgetRequest.save();

    // Log success for the budget request
    await createLog({
      path: logPath,
      action: logAction,
      remarks: `Budget requested for ${departmentExists.department.name}`,
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: newBudgetRequest._id,
      changes: { amount, dueDate, expanseName },
    });

    return res.status(200).json({
      message: `Budget requested for ${departmentExists.department.name}`,
    });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
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
