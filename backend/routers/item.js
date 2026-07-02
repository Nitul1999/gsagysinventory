import express from 'express'

import db from '../dbconfig/dbconfig.js';
import { verifyToken } from '../middleware/Authmiddleware.js';

const router = express.Router();


router.get("/view_all_items", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected" });
    }

    const [rows] = await db.query("SELECT * FROM items");

    res.status(200).json(rows);

  } catch (error) {
    console.error("❌ Database error:", error.message);
    res.status(500).json({ message: "Database query failed" });
  }
});

// return total items
 router.get("/view_total_items/all",async(req,res)=>{
  try {
    if(!db){
       return res.status(500).json({ message: "Database not connected" });
    }
    const [row] = await db.query("select count(*) from items")
    res.status(200).json(row)
  } catch (error) {
    res.status(500).json({ message: "Database query failed" });
  }
 })



// 🟢 INSERT NEW ITEM
router.post("/add_new_item",verifyToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected" });
    }

    const {
      name,
      description,
      total_quantity,
      available_quantity,
      color,
      item_condition,
      item_price,
    } = req.body;

    // Validate inputs
    if (!name || !total_quantity || !available_quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    // 🔹 Validate numeric values
    if (available_quantity > total_quantity) {
      return res
        .status(400)
        .json({ message: "Available quantity cannot exceed total quantity" });
    }

    if (total_quantity < 0 || available_quantity < 0) {
      return res
        .status(400)
        .json({ message: "Quantities must be non-negative numbers" });
    }


    // ✅ Generate custom item_id like agitem001, agitem002
    const [lastRow] = await db.query(
      "SELECT item_id FROM items ORDER BY created_at DESC LIMIT 1"
    );

    let nextId = "agitem001"; // default for first record

    if (lastRow.length > 0) {
      const lastId = lastRow[0].item_id; // e.g. 'agitem007'
      const lastNum = parseInt(lastId.replace("agitem", ""), 10);
      const newNum = lastNum + 1;
      nextId = `agitem${String(newNum).padStart(3, "0")}`;
    }

    // ✅ Insert query
    const sql = `
      INSERT INTO items
      (item_id, name, description, total_quantity, available_quantity, color, item_condition, item_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      nextId,
      name,
      description || null,
      total_quantity,
      available_quantity,
      color || null,
      item_condition || "good",
      item_price || 0,
    ]);

    res.status(201).json({
      message: "Item added successfully",
      item_id: nextId,
      success:true
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to insert item..Try Again" });
  }
});

//update item details
router.put('/update_item_details/:item_id',verifyToken,async(req,res)=>{
try {
    const { item_id } = req.params;
    const {
      name,
      total_quantity,
      available_quantity,
      color,
      item_price,
      item_condition,
      description,
    } = req.body;

    //  Validate item_id
    if (!item_id) {
      return res.status(400).json({ message: "Item ID is required in the URL." });
    }
    // 🔍 Fetch existing item to validate quantities
    const [existingRows] = await db.query("SELECT * FROM items WHERE item_id = ?", [item_id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Item not found." });
    }

    const existing = existingRows[0];

    // Determine what the new values would be
    const newTotal = total_quantity ?? existing.total_quantity;
    const newAvailable = available_quantity ?? existing.available_quantity;

    //Check constraint manually before update
    if (newAvailable > newTotal) {
      return res.status(400).json({
        message: `Available quantity (${newAvailable}) cannot exceed total quantity (${newTotal}).`,
      });
    }
    // Ensure at least one field to update
    if (
      !name &&
      !total_quantity &&
      !available_quantity &&
      !color &&
      !item_price &&
      !item_condition &&
      !description
    ) {
      return res.status(400).json({ message: "No fields provided to update." });
    }

    //  Build SQL dynamically based on provided fields
    const updates = [];
    const values = [];

    if (name) {
      updates.push("name = ?");
      values.push(name);
    }
    if (total_quantity) {
      updates.push("total_quantity = ?");
      values.push(total_quantity);
    }
    if (available_quantity) {
      updates.push("available_quantity = ?");
      values.push(available_quantity);
    }
    if (color) {
      updates.push("color = ?");
      values.push(color);
    }
    if (item_price) {
      updates.push("item_price = ?");
      values.push(item_price);
    }
    if (item_condition) {
      updates.push("item_condition = ?");
      values.push(item_condition);
    }
    if (description) {
      updates.push("description = ?");
      values.push(description);
    }

    // Add the item_id at the end for the WHERE clause
    values.push(item_id);

    const sql = `UPDATE items SET ${updates.join(", ")} WHERE item_id = ?`;

    // 4️⃣ Execute update query
    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found or no changes made." });
    }

    res.status(200).json({ message: "✅ Item updated successfully." });
  } catch (error) {
    console.error("❌ Error updating item:", error.message);
    res.status(500).json({ message: "Server error while updating item." });
  }
});

//delete a item
router.delete("/delete_item/:item_id",verifyToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ message: "Database not connected" });
    }

    const { item_id } = req.params;

    // 🔹 Check if item_id was provided
    if (!item_id) {
      return res.status(400).json({ message: "Item ID is required" });
    }

    // 🔹 Check if the item exists first
    const [existing] = await db.query("SELECT * FROM items WHERE item_id = ?", [item_id]);

    if (existing.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔹 Delete the item
    await db.query("DELETE FROM items WHERE item_id = ?", [item_id]);

    res.status(200).json({
      message: `✅ Item '${item_id}' deleted successfully.`,
    });
  } catch (error) {
    console.error("❌ Error deleting item:", error.message);
    res.status(500).json({
      message: "Failed to delete item",
      error: error.message,
    });
  }
});



export default router;