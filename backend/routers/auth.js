import express  from "express"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../dbconfig/dbconfig.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router()

router.post("/login", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ message: "Database not connected" });

    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    // 1️⃣ Check if user exists
    const [rows] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Phone Number Not Registered" });
    }

    const user = rows[0];

    // 2️⃣ Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      {
        phone: user.phone,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // 5️⃣ Respond with token + user info
    res.status(200).json({
      message: "✅ Login successful",
      token,
    //   user: {
    //     name: user.name,
    //     phone: user.phone,
    //     email: user.email,
    //     role: user.role,
    //   },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Login failed" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // 🔹 Basic validation
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone, and password are required" });
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    // 🔹 Check if user already exists
    const [existing] = await db.query("SELECT phone FROM users WHERE phone = ?", [phone]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "User with this phone number already exists" });
    }

    // 🔹 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Insert into database
    const sql = `
      INSERT INTO users (name, phone, email, password, role)
      VALUES (?, ?, ?, ?, 'user')
    `;
    await db.query(sql, [name, phone, email || null, hashedPassword]);

    res.status(201).json({ message: "✅ Registration successful ~~ Now You Can Log-In" });
  } catch (error) {
    console.error("❌ Registration error:", error.message);
    res.status(500).json({ message: "Failed to register user" });
  }
});

router.post("/forget-password", async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 1️⃣ Validate input
    if (!phone || !password) {
      return res.status(400).json({ message: "Phone number and new password are required" });
    }

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // 2️⃣ Check if user exists
    const [existing] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "Phone Number Not Registered || Register Yourself First To Log-In" });
    }

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Update user's password
    await db.query("UPDATE users SET password = ? WHERE phone = ?", [hashedPassword, phone]);

    res.status(200).json({ message: "✅ Password reset successful" });
  } catch (error) {
    console.error("❌ Error resetting password:", error.message);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

export default router;