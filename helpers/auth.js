const expressJwt = require("express-jwt");
const config = require("../config/config");

module.exports.authorize = function(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressJwt({ secret: config.jwt_secret }),
    // authorize based on user role
    (req, res, next) => {
      //console.log(req)
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role is not authorized
        return res.status(401).json({ message: "Unauthorized" });
      }
      // authentication and authorization successful
      next();
    }
  ];
};

module.exports.getUserName = function(req) {
  if (req.user) {
    return `${req.user.firstName} ${req.user.lastName}`;
  } else {
    return null;
  }
};
