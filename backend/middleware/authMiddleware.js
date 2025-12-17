// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const raw = req.header("Authorization") || "";
  const token = raw.startsWith("Bearer ") ? raw.replace("Bearer ", "") : raw;
  if (!token) return res.status(401).json({ msg: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // expect decoded to contain { id, role }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "No user" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ msg: "Insufficient role" });
    next();
  };
}

module.exports = { verifyToken, allowRoles };
