const Permissions = require("../../models/Permissions");
const masterPermissions = require("../../config/masterPermissions");
const UserData = require("../../models/hr/UserData");

const allUserPermissions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const foundUser = await UserData.findOne({ _id: userId })
      .select("permissions")
      .populate("permissions")
      .lean()
      .exec();

      
  } catch (error) {
    next(error);
  }
};
