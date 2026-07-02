import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    // 1️⃣ Get token from header: "Authorization: Bearer <token>"
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // extract after 'Bearer'

    if (!token) {
      return res.status(401).json({ message: "Access denied. Login Again Please." });
    }

    // 2️⃣ Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Please Login Again..." });
      }

      // 3️⃣ Attach user info to request
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    res.status(500).json({ message: "Server error while verifying..." });
  }
};
