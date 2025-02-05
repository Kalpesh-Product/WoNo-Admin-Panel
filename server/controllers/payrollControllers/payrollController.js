const { default: mongoose } = require("mongoose");
const Payroll = require("../../models/Payroll");
const User = require("../../models/UserData");

const generatePayroll = async (req, res, next) => {
  try {
    const { totalSalary, reimbursment } = req.body;
    const { userId } = req.params;

    if (!totalSalary) {
      return res.status(400).json({ message: "invalid payroll data" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "invalid user ID" });
    }

    const foundUser = await User.findOne({ _id: userId }).lean().exec();
    if (!foundUser) {
      return res.status(404).json({ message: "No such user found" });
    }

    const newPayroll = new Payroll({
      empoloyee: userId,
      reimbursment,
      totalSalary,
    });

    await newPayroll.save();
    res.status(200).json({ message: "Payroll generated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { generatePayroll };
