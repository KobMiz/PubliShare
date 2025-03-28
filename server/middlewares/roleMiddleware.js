const roles = {
  admin: (user) => user.isAdmin,
  user: (user) => !user.isAdmin,
};

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      console.warn("Access denied: User not authenticated.");
      return res
        .status(401)
        .json({ error: "Access denied. User not authenticated." });
    }

    if (!roles[requiredRole]) {
      console.error(`Invalid role specified in middleware: ${requiredRole}`);
      return res.status(500).json({ error: "Server error. Invalid role." });
    }

    if (requiredRole === "user" && req.method === "GET") {
      console.log(
        `Access granted: User ${req.user?._id} is allowed to view profiles.`
      );
      return next(); 
    }

    if (roles[requiredRole](req.user)) {
      console.log(
        `Access granted: User ${req.user?._id} has the required role (${requiredRole}).`
      );
      return next();
    }

    console.warn(
      `Access denied: User ${req.user?._id} attempted to access a ${requiredRole} route without sufficient permissions.`
    );
    return res
      .status(403)
      .json({ error: "Access denied. Insufficient permissions." });
  };
};

module.exports = roleMiddleware;
