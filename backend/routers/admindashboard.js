import express from "express";
import bcrypt from "bcryptjs";
import db from "../dbconfig/dbconfig.js";
import { verifyToken } from "../middleware/Authmiddleware.js";
const router = express.Router();

//to get total users from users table
router.get("/get_total_member", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected!!" });
    }
    const [row] = await db.query("select count(*) as totalMember from users");
    res.status(200).json({ totalMember: row[0].totalMember });
  } catch (error) {
    res.status(500).json({ message: "Operations Failed..Try Again..." });
  }
});

//to get total item from items table
router.get("/get_total_items", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected" });
    }
    const [row] = await db.query("select count(*) as totalItem from items");
    res.status(200).json({ totalItem: row[0].totalItem });
  } catch (error) {
    res.status(500).json({ message: "Database query failed" });
  }
});

//to get total booking from bookedd_details table
router.get("/get_total_booking", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected!!" });
    }
    const [row] = await db.query(
      "SELECT COUNT(*) AS totalBookings FROM booked_details"
    );

    res.status(200).json({ totalBookings: row[0].totalBookings });
  } catch (error) {
    res.status(500).json({ message: "Operations Failed..Try Again..." });
  }
});

// to get total booked details items which status is pending
router.get("/get_total_pending_item", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({
        message: "Database not connected...Try Again..",
        success: false,
      });
    }
    const [data] = await db.query(
      "select count(*) as totalpending from booked_details where verify = 0 "
    );
    res.status(200).json({ totalpending: data[0].totalpending });
  } catch (error) {
    res.status(500).json({ message: "Operations Failed..Try Again..." });
  }
});

// to get total booked details items which status is return
router.get("/get_total_return_item", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected!!" });
    }
    const [row] = await db.query(
      `SELECT COUNT(*) AS totalreturns FROM booked_details where status = "returned" or status ="RETURNED" `
    );

    res.status(200).json({ totalReturns: row[0].totalreturns });
  } catch (error) {
    res.status(500).json({ message: "Operations Failed..Try Again..." });
  }
});

//

// to get total booked details items which status is booked means not returned
router.get("/get_total_booked_item", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected!!" });
    }
    const [row] = await db.query(
      `SELECT COUNT(*) AS totalbooked FROM booked_details where status = "booked" or status ="BOOKED" `
    );

    res.status(200).json({ totalBooked: row[0].totalbooked });
  } catch (error) {
    res.status(500).json({ message: "Operations Failed..Try Again..." });
  }
});

//to get all booking details, join items ,booked_details,users table
router.get("/get_all_bookings_details", verifyToken, async (req, res) => {
  try {
    if (!db) {
      return res
        .status(500)
        .json({ message: "Database Not Connected..Try Again", success: false });
    }
    const [data] = await db.query(
      "select bd.booking_id,bd.user_phone,bd.item_id,bd.item_quantity,bd.booked_date,bd.return_date,bd.status,bd.reason,bd.verify,i.name as itemname,u.name as username,u.phone,u.email,u.father_name from booked_details bd join users u on bd.user_phone = u.phone join items i on i.item_id = bd.item_id ORDER BY bd.booked_date DESC"
    );
    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No Booking Details Found", message: false });
    }
    res.status(200).json({
      message: "All Booking Details",
      success: true,
      allbookings: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking details..Try again!!",
      success: false,
    });
  }
});
//get all return item (which status is return only
router.get("/get_booking_item_returned", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({
        message: "Database not connected...Try again..",
        success: false,
      });
    }
    const [data] = await db.query(
      `select bd.booked_date,bd.return_date,bd.reason,bd.item_quantity, i.name as item_name, u.name as user_name,u.phone,u.father_name from booked_details bd join items i on bd.item_id = i.item_id join users u on bd.user_phone = u.phone where bd.status ="returned" or bd.status="RETURNED"`
    );
    if (data.length === 0) {
      return res.status(404).json({ message: "Data Not Available" });
    }
    res
      .status(200)
      .json({ message: "All returned items", success: true, returned: data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data", success: false });
  }
});
//get all item and user details, which status is not return, means booked but not return status
router.get("/get_item_pending_return/user", verifyToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({
        message: "Database not connected...Try again..",
        success: false,
      });
    }
    const [data] = await db.query(
      `select bd.booked_date,bd.reason,bd.item_quantity, i.name as item_name, u.name as user_name,u.phone,u.father_name from booked_details bd join items i on bd.item_id = i.item_id join users u on bd.user_phone = u.phone where bd.status ="booked" or bd.status="BOOKED"`
    );
    if (data.length === 0) {
      return res.status(404).json({ message: "Data Not Available" });
    }
    res.status(200).json({ success: true, pending: data });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data", success: false });
  }
});
//view all not verify booking item
router.get("/get_item_unverify_all", verifyToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({
        message: "Database not connected..Try again..",
        success: false,
      });
    }
    const [data] = await db.query(
      `select bd.booking_id, bd.booked_date,bd.reason,bd.item_quantity,bd.verify, i.name as item_name, u.name as user_name,u.phone from booked_details bd join items i on bd.item_id = i.item_id join users u on bd.user_phone = u.phone where bd.verify =0 order by booked_date desc`
    );
    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "Empty Booking to verify", success: false });
    }
    res.status(200).json({
      message: "All Unverified Items..",
      success: true,
      unverified: data,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data", success: false });
  }
});

// approved booking
router.patch("/verify_booking_item", verifyToken, async (req, res) => {
  try {
    if (!db) {
      return res
        .status(500)
        .json({ message: "Database not connected..Try again", success: false });
    }
    const { booking_id } = req.body;
    const [item] = await db.query(
      `select * from booked_details where booking_id=?`,
      [booking_id]
    );
    if (item.length === 0) {
      return res
        .status(404)
        .json({ message: "Booking details not found", success: false });
    }
    await db.query(`update booked_details set verify = 1 where booking_id=?`, [
      booking_id,
    ]);
    return res.status(200).json({
      message: "Booking verified successfully",
      success: true,
    });
  } catch (error) {}
});
//approved all
router.patch("/verify_all_booking_item", verifyToken, async (req, res) => {
  try {
    if (!db) {
      return res
        .status(500)
        .json({ message: "Database not connected..Try again", success: false });
    }

    // Update verify value for all records to true(1)
    const [result] = await db.query(`UPDATE booked_details SET verify = 1`);

    // Check if any rows were updated
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "No booking records found to update",
        success: false,
      });
    }

    return res.status(200).json({
      message: "All bookings verified successfully",
      success: true,
      updated_rows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error verifying all bookings →", error);
    res
      .status(500)
      .json({ message: "Failed to verify bookings", success: false });
  }
});

//get all recent booking
router.get("/get_all/recent_booking", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({
        message: "Database not connected..Try again..",
        success: false,
      });
    }
    const [data] = await db.query(
      `select bd.booking_id, bd.booked_date,bd.item_quantity,bd.status,bd.verify, i.name as item_name, u.name as user_name from booked_details bd join items i on bd.item_id = i.item_id join users u on bd.user_phone = u.phone where bd.status="booked" order by booked_date desc`
    );
    if (data.length === 0) {
      return res.status(404).json({ message: " Empty ", success: false });
    }
    res.status(200).json({
      message: "All Recent Bookings..",
      success: true,
      recentbooking: data,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data", success: false });
  }
});

//change member role
router.patch("/change/member-role", verifyToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({
        message: "Database Not Connected..Try Again!!",
        success: false,
      });
    }
    const { phone, role } = req.body;
    // 1️⃣ Validate Inputs
    if (!phone || !role) {
      return res
        .status(400)
        .json({ message: "Phone and role are required!", success: false });
    }
    // 2️⃣ Check if user exists
    const [user] = await db.query("SELECT * FROM users WHERE phone = ?", [
      phone,
    ]);
    if (user.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found!", success: false });
    }
    // 3️⃣ Update user role
    await db.query(`UPDATE users SET role = ? WHERE phone = ?`, [role, phone]);

    return res.status(200).json({
      message: "User role updated successfully!",
      success: true,
      updated_user: { phone, role },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user role..Try again!!",
      success: false,
    });
  }
});

// cost summary
//cost of each items
router.get("/items_price/total", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({
        message: "Database Not Connected..Try Again!!",
        success: false,
      });
    }
    const [rows] = await db.query(
      "SELECT item_id, name,total_quantity,item_price,(total_quantity * item_price) AS total_item_price FROM items;"
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false });
    }
    res.status(200).json({ success: true, totalprice: rows });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch total cost of each items",
      success: false,
    });
  }
});

//total cost of all items till date
router.get("/item_total_cost/amount", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({
        message: "Database Not Connected..Try Again!!",
        success: false,
      });
    }
    const [rows] = await db.query(
      "SELECT SUM(total_quantity * item_price) AS total_inventory_value FROM items;"
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false });
    }
    res.status(200).json({ success: true, totalcost: rows });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch total cost ",
      success: false,
    });
  }
});

export default router;
