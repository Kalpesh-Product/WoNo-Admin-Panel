const Vendor = require("../../models/Vendor");
const User = require("../../models/UserData");
const Company = require("../../models/Company");
const mongoose = require("mongoose");

const onboardVendor = async (req, res, next) => {
  try {
    const {
      name,
      address,
      departmentId, // Received from frontend
      state,
      country,
      pinCode,
      panItNo,
      gstUin,
      registrationType,
      assesseeOfOtherTerritory,
      isEcommerceOperator,
      isDeemedExporter,
      partyType,
      gstinUin,
      isTransporter,
    } = req.body;

    const userId = req.user;

    // Fetch the current user
    const currentUser = await User.findOne({ _id: userId })
      .select("department company")
      .lean()
      .exec();

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is part of the given department
    if (!currentUser.department.includes(departmentId)) {
      return res.status(403).json({
        message: "You are not a member of this department.",
      });
    }

    // Find the company document where the user is an admin of the given department
    // const companyDoc = await Company.findOne({
    //   _id: currentUser.company, // Match the user's company
    //   "selectedDepartments": {
    //     $elemMatch: {
    //       department: departmentId, // Check if the department exists in the company
    //       admin: userId, // Ensure the user is an admin of the department
    //     },
    //   },
    // })
    //   .lean()
    //   .exec();

    const companyDoc = await Company.findOne({
      _id: currentUser.company, // Match the user's company
      selectedDepartments: {
        $elemMatch: {
          department: departmentId, // Match the department ID
          $or: [
            { admin: new mongoose.Types.ObjectId(userId) }, // Check if userId exists in the admin array
            { admin: { $size: 0 } }, // Check if the admin array is empty
          ],
        },
      },
    })
      .lean()
      .exec();
    
    

    if (!companyDoc) {
      return res.status(403).json({
        message: "You are not authorized to onboard a vendor for this department.",
      });
    }

    // Step 2: Create and Save the Vendor
    const newVendor = new Vendor({
      name,
      address,
      departmentId, // Store the validated department
      company: companyDoc._id, // Ensure correct company reference
      state,
      country,
      pinCode,
      panItNo,
      gstUin,
      registrationType,
      assesseeOfOtherTerritory,
      isEcommerceOperator,
      isDeemedExporter,
      partyType,
      gstinUin,
      isTransporter,
    });

    await newVendor.save();

    res
      .status(201)
      .json({ message: "Vendor onboarded successfully", vendor: newVendor });
  } catch (error) {
    next(error);
  }
};

module.exports = { onboardVendor };
