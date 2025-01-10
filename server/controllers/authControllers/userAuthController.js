const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const registerLogs = require("../../utils/loginLogs");
const bcrypt = require("bcryptjs");
const generatePassword = require("../../utils/passwordGenerator");
const mailer = require("../../config/nodemailerConfig");
const emailTemplates = require("../../utils/emailTemplates");

const login = async (req, res, next) => {
  try {
    const ipAddress = req.ip;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const { email, password } = req.body;

    if (!emailRegex.test(email)) {
      await registerLogs({
        email,
        status: "failed",
        ip: ipAddress,
        message: "Invalid credentials format",
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!password)
      return res.status(400).json({ message: "Invalid credentials" });

    const userExists = await User.findOne({ email })
      .select("name role email phone empId department")
      .populate({
        path: "department",
        select: "name departmentId",
      })
      .populate({
        path: "role",
        select: "roleTitle modulePermissions",
        populate: [
          {
            path: "modulePermissions.module",
            select: "moduleTitle",
          },
          {
            path: "modulePermissions.subModulePermissions.subModule",
            select: "subModuleTitle",
          },
        ],
      })
      .populate({ path: "designation", select: "title" })
      .populate({ path: "company", select: "companyName" })
      .lean();

    if (!userExists) {
      await registerLogs({
        email,
        status: "failed",
        ip: ipAddress,
        message: "Invalid credentials format",
      });
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          userId: userExists._id,
          role: userExists.role,
          email: userExists.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        email: userExists.email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );

    await registerLogs({
      email,
      status: "success",
      ip: ipAddress,
      message: "Login successful",
    });

    await User.findOneAndUpdate({ _id: userExists._id }, { refreshToken });

    res.cookie("clientCookie", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user: userExists, accessToken });
  } catch (error) {
    next(error);
  }
};

const logOut = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.clientCookie) return res.sendStatus(204);

    const refreshToken = cookie.clientCookie;
    const foundUser = await User.findOne({ refreshToken }).lean().exec();

    if (!foundUser) {
      res.clearCookie("clientCookie", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }

    await User.findOneAndUpdate({ _id: foundUser._id }, { refreshToken: null })
      .lean()
      .exec();

    res.clearCookie("clientCookie", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const checkPassword = async (req, res, next) => {
  try {
    const { id, currentPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(id).lean().exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password matches the user's stored password
    if (user.password !== currentPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      message: "Password matches",
    });
  } catch (error) {
    console.error("Error checking password: ", error);
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { id, newPassword, confirmPassword } = req.body;

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    // Find the user by ID and update the password
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { password: newPassword } }, // Update the password field
      { new: true, runValidators: true } // Return the updated document and enforce validation
    )
      .lean()
      .exec();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error updating password: ", error);
    next(error);
  }
};

module.exports = { login, logOut, checkPassword, updatePassword };
