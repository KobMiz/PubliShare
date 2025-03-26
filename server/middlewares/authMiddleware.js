const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  console.log("🔍 Authorization Header Received:", authHeader); // first check

  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    console.warn("❌ Access denied: No token provided or invalid format.");
    return res
      .status(401)
      .json({ error: "Access denied. User not authenticated." });
  }

  try {
    const token = authHeader.split(" ")[1];
    console.log("🔍 Extracted Token:", token); // check no' 2 

    if (!token) {
      console.warn("❌ Access denied: Token is missing after 'Bearer'.");
      return res.status(401).json({ error: "Access denied. Invalid token." });
    }

    console.log("🔍 JWT_SECRET from .env:", process.env.JWT_SECRET); // check no' 3

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded Successfully:", decoded); // check no' 4

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token verification error:", err.message);

   if (err.name === "TokenExpiredError") {
     return res.status(401).json({
       error: "זמן ההתחברות שלך הסתיים. נא להתחבר מחדש.",
     });
   }


    return res.status(403).json({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;
