const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const handleRefreshToken = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.clientCookie) return res.sendStatus(401);

    const refreshToken = cookie.clientCookie;
    const user = await User.findOne({ refreshToken })
      .select("name role email empId department")
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
    if (!user) return res.sendStatus(403);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err || user.email !== decoded.email) {
          return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
          {
            userInfo: {
              email: decoded.email,
              role: user.role,
              userId: user._id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        delete user.refreshToken;
        delete user.credentials?.password;
        delete user.updatedAt;

        res.json({
          accessToken,
          user,
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = handleRefreshToken;
