import express from "express";
import bcrypt from "bcryptjs";
import db from "../dbconfig/dbconfig.js";
import { verifyToken } from "../middleware/Authmiddleware.js";
const router = express.Router();

//view all users
router.get("/view_all_users", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected" });
    }

    const [rows] = await db.query(`
      SELECT name, father_name, phone, email, role, created_at 
      FROM users
      ORDER BY created_at DESC
    `);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});
// return total users/count
router.get("/total_user",async(req,res)=>{
  try {
    if(!db){
      return res.status(500).json({message:"Database not connected!!"});
    }
    const [row] = await db.query("select count(*) from users");
    res.status(200).json(row);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
})

//add new user
router.post("/add_new_user", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected" });
    }

    const { name, father_name, phone, email, password } = req.body;

    // ✅ Validate required fields
    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Name, phone, and password are required" });
    }

    // ✅ Validate phone number
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    // ✅ Check if user already exists
    const [existing] = await db.query("SELECT phone FROM users WHERE phone = ?", [phone]);

    if (existing.length > 0) {
      return res.status(409).json({ message: "User with this phone number already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new user (role always set to 'user')
    const sql = `
      INSERT INTO users (name, father_name, phone, email, role, password)
      VALUES (?, ?, ?, ?, 'user', ?)
    `;

    await db.query(sql, [
      name,
      father_name || null,
      phone,
      email || null,
      hashedPassword,
    ]);

    res.status(201).json({ message: "User added successfully" });

  } catch (error) {
    console.error("❌ Error adding user:", error.message);
    res.status(500).json({ message: "Failed to add user" });
  }
});

// 🟢 VIEW ONLY ADMINS
router.get("/view_admins", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ message: "Database not connected" });

    const [rows] = await db.query(`
      SELECT name, father_name, phone, email, role, created_at
      FROM users
      WHERE role = 'admin'
      ORDER BY created_at DESC
    `);

    if (rows.length === 0)
      return res.status(404).json({ message: "No admin users found" });

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error fetching admins:", error.message);
    res.status(500).json({ message: "Failed to fetch admins" });
  }
});
//update a user details by admin
router.put("/update_employee_by_admin/:phone",verifyToken,async(req,res)=>{
 try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected.." });
    }

    const { phone } = req.params;
    const { name, father_name, email, role,designation } = req.body;
    console.log(designation);

    // 🔹 Validate input
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    // 🔹 Check if user exists
    const [existing] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // 🔹 Update query
    const sql = `
      UPDATE users 
      SET 
        name = COALESCE(?, name),
        father_name = COALESCE(?, father_name),
        email = COALESCE(?, email),
        designation=COALESCE(?,designation),
        role = COALESCE(?, role)
      WHERE phone = ?
    `;

    await db.query(sql, [name, father_name, email, designation, role, phone]);

    res.status(200).json({ message: "✅ User details updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user details" });
  }
})
//remove or delete a users by admin only
router.delete("/delete_user_by_admin/:phone",verifyToken,async(req,res)=>{
   try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected.." });
    }

    const { phone } = req.params;
    console.log(phone)

    // 🔹 Validate input
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // 🔹 Only admins can delete users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // 🔹 Check if user exists
    const [existing] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (existing.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // 🔹 Delete user
    await db.query("DELETE FROM users WHERE phone = ?", [phone]);

    res.status(200).json({ message: `✅ User with phone ${phone} deleted successfully.` });
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    res.status(500).json({ message: "Failed to delete user." });
  }
})



//view only users
router.get("/view_normal_users", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ message: "Database not connected" });

    const [rows] = await db.query(`
      SELECT name, father_name, phone, email, role,designation, created_at
      FROM users
      WHERE role = 'user'
      ORDER BY created_at DESC
    `);

    if (rows.length === 0){
        return res.status(404).json({ message: "No normal users found" });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});
//view a signle user by phone profile
router.get("/profile/:phone",verifyToken,async(req,res)=>{
  try {
    if(!db){
      return res.status(500).json({message:"Database not connected"})
    }
    const { phone } = req.params;
    
    const [rows] = await db.query("SELECT name, father_name, phone, email, role,designation FROM users WHERE phone = ?", [phone]);
    if(rows.length===0){
      return res.status(404).json({message:"User account not found!!"})
    }
    res.status(200).json(rows[0])
  } catch (error) {
     res.status(500).json({ message: "Failed to fetch user profile" });
  }
})
//profile update
router.put("/update/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const { name, father_name, email } = req.body;
    await db.query(
      "UPDATE users SET name=?, father_name=?, email=? WHERE phone=?",
      [name, father_name, email, phone]
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

//get-contact persons info-
router.get("/contact/person",async(req,res)=>{
  try {
     if(!db){
      return res.status(500).json({message:"Database not connected"})
    }
    const sql = `
      SELECT name, phone, email, designation
      FROM users
      WHERE designation IN (
        'president',
        'secretary',
        'public_relations_office',
        'event_coordinator'
      )
    `;
    const [rows] = await db.query(sql)
    if(rows.length===0){
      return res.status(404).json({message:"Data not found"});
    }
    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ message: "Error While Fetching Data...Try Again" });
  }
})


export default router;