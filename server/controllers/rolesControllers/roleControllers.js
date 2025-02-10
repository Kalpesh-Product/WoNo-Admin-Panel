const Role = require("../../models/Roles"); // Adjust path as needed

const addRole = async (req, res, next) => {
  try {
    const { roleTitle } = req.body;
    const roleExists = await Role.findOne({ roleTitle }).lean().exec();
    if (roleExists) {
      return res.status(400).json({ message: "role already exists" });
    }
    const newRole = new Role({ roleTitle });
    await newRole.save();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().lean().exec();
    return res.status(200).json(roles);
  } catch (error) {
    next(error);
  }
};

module.exports = { addRole, getRoles };
