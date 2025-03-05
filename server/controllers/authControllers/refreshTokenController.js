const jwt = require("jsonwebtoken");
const User = require("../../models/hr/UserData");

const handleRefreshToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.clientCookie) {
      return res.sendStatus(401);
    }

    const refreshToken = cookies.clientCookie;

    const userExists = await User.findOne({ refreshToken })
      .select(
        "firstName lastName role email empId company password designation departments selectedDepartments"
      )
      .populate([
        {
          path: "company",
          select:
            "companyName selectedDepartments workLocations employeeTypes shifts policies agreements sops permissions",
          populate: {
            path: "selectedDepartments.department",
            select: "name",
            model: "Department",
          },
        },
        { path: "role", select: "roleTitle" },
        { path: "departments", select: "name" },
        { path: "permissions" },
      ])
      .lean()
      .exec();

    if (!userExists) {
      return res.sendStatus(403);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err || userExists.email !== decoded.email) {
          return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
          {
            userInfo: {
              email: decoded.email,
              role: userExists.designation,
              userId: userExists._id,
              company: userExists.company._id,
              departments: userExists.departments,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30m" }
        );

        delete userExists.refreshToken;
        delete userExists.password;
        delete userExists.updatedAt;

        res.json({
          accessToken,
          user: userExists,
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = handleRefreshToken;
