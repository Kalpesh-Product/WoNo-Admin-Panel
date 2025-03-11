const Budget = require("../../models/budget/Budget");
const User = require("../../models/hr/UserData");
const Company = require("../../models/hr/Company");
const CustomError = require("../../utils/customErrorlogs");
const { createLog } = require("../../utils/moduleLogs");

const requestBudget = async (req, res, next) => {
  const logPath = "BudgetLogs";
  const logAction = "Request Budget";
  const logSourceKey = "budget";
  const { user, ip, company } = req;

  try {
    const { amount, dueDate, expanseName, expanseType } = req.body;
    const { departmentId } = req.params;

    if (!amount || !dueDate || !expanseName || !expanseType) {
      throw new CustomError(
        "Invalid budget data",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .lean()
      .exec();
    if (!foundUser) {
      throw new CustomError("Unauthorized", logPath, logAction, logSourceKey);
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
      expanseType,
      department: departmentId,
      company: companyDoc._id,
      dueDate,
      amount,
      status: "Pending",
    });

    await newBudgetRequest.save();

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
      changes: { amount, dueDate, expanseName, expanseType },
    });

    return res.status(200).json({
      message: `Budget requested for ${departmentExists.department.name}`,
    });
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError(error.message, logPath, logAction, logSourceKey, 500)
    );
  }
};

const fetchBudget = async (req, res, next) => {
  try {
    const { departmentId } = req.params;
    const { user } = req;

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .populate([{ path: "company", select: "companyName" }])
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(400).json({ message: "No user found" });
    }

    const query = { company: foundUser.company };
    if (departmentId) {
      query.department = departmentId;
    }

    const allBudgets = await Budget.find(query)
      .populate([{ path: "department", select: "name" }])
      .lean()
      .exec();

    res.status(200).json({ allBudgets });
  } catch (error) {
    next(error);
  }
};

module.exports = { requestBudget, fetchBudget };
