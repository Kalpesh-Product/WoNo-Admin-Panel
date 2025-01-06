const roles = require("../config/roles");

const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = [...allowedRoles];
    const currentRole = req.role;
    if (!currentRole) return res.sendStatus(401);
    if (!Object.values(roles).includes(currentRole)) {
      return res.sendStatus(401);
    }
    if (!role.includes(currentRole)) {
      return res.sendStatus(401);
    }
    next();
  };
};

module.exports = verifyRole;
