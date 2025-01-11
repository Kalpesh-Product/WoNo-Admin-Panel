const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: "Unauthorized" });

  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });

    req.user = decoded.userInfo.email;
    req.role = decoded.userInfo.role;
    next();
  });
};

module.exports = verifyJwt;
