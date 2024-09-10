const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from header
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user; // Attach user info to request
      next();
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = { authenticateJWT };
