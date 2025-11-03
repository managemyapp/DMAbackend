const jwt = require("jsonwebtoken");
require("dotenv").config();

function requireAdminLogin(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "INVALID_ADMIN_TOKEN" });
  }
  const token = authorization.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ error: "INVALID_ADMIN_TOKEN" });
  }

  jwt.verify(token, process.env.JWT_SECRET_ADMIN, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "INVALID_ADMIN_TOKEN" });
    }

    req.user = user;
    next();
  });
}

module.exports = requireAdminLogin;
