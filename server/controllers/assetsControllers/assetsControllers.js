const Asset = require("../../models/assets/Assets");
const User = require("../../models/UserData");
const Company = require("../../models/Company");
const Category = require("../../models/assets/AssetCategory");

const addAsset = async (req, res, next) => {
  try {
    const {
      departmentId,
      categoryId,
      vendorId,
      name,
      purchaseDate,
      quantity,
      price,
      brand,
      status,
    } = req.body;

    const user = req.user;
    const foundUser = await User.findOne({ _id: user })
      .select("company departments role")
      .populate([{ path: "role", select: "roleTitle" }])
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(400).json({ message: "No user found" });
    }

    const foundCompany = await Company.findOne({
      _id: foundUser.company,
    })
      .select("selectedDepartments")
      .lean()
      .exec();

    if (!foundCompany) {
      return res.status(400).json({ message: "company not found" });
    }

    doesDepartmentExists = foundCompany.selectedDepartments.find(
      (dept) => dept._id.toString() === departmentId
    );

    if (!doesDepartmentExists) {
      return res
        .status(400)
        .json({ message: "department not selected by your company" });
    }

    const foundCategory = await Category.findOne({ _id: categoryId })
      .lean()
      .exec();
    if (!foundCategory) {
      return res.status(400).json({ message: "No category found" });
    }
  } catch (error) {
    next(error);
  }
};



module.exports = { addAsset };
