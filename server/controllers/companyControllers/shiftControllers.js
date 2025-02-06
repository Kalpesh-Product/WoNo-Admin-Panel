
const Company = require("../../models/Company");
const User = require("../../models/User");

const addShift = async (req, res, next) => {
    try {
      const user = req.user;
      const { shiftName } = req.body;
  
      const foundUser = await User.findOne({ _id: user })
        .select("company")
        .lean()
        .exec();
  
      if (!foundUser) {
        return res.status(400).json({ message: "user not found" });
      }
  
      const company = await Company.findOne({ _id: foundUser.company })
        .lean()
        .exec();
  
      if (!company) {
        return res.status(400).json({ message: "No such company exists" });
      }
  
      await Company.findOneAndUpdate(
        { _id: foundUser.company },
        { $push: { shifts: shiftName } }
      ).exec();
  
      return res.status(200).json({ message: "work shift added successfully" });
    } catch (error) {
      next(error);
    }
  }

  module.exports = {addShift}