const jwt = require("jsonwebtoken");
require("dotenv").config(); 

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; 

  if (!token) {
    return res.status(403).json({ error: "Token is required" });
  }

  const secretKey = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("✅ Decoded Token:", decoded);
    req.user = decoded; 
    next(); 
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
