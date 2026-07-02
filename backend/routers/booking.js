import express from 'express'
import db from '../dbconfig/dbconfig.js';
const router = express.Router();

// return total booking items count
router.get("/total_booking",async(req,res)=>{
  try {
    if(!db){
      return res.status(500).json({message:"Database not connected!!"});
    }
    const [row] = await db.query("select count(*) from booked_details");
    res.status(200).json(row);
  } catch (error) {
      res.status(500).json({ message: "Operations Failed..Try Again..." });
  }
})

router.post('/items/user_booking/:phone',async(req,res)=>{
    try {
        const {phone} = req.params;
        const {booked_items} =req.body
        if(!db){
            return res.status(500).json({message:"Database not connected!!"})
        }
         console.log("📦 Incoming booking request:", { phone, booked_items });

       for (const item of booked_items) {
            const { item_id, item_quantity,reason } = item;
            console.log(`🔹 Inserting booking: phone=${phone}, item=${item_id}, qty=${item_quantity}`);
            await db.query(
                "INSERT INTO booked_details (user_phone, item_id, item_quantity,reason) VALUES (?, ?, ?,?)",
                [phone, item_id, item_quantity,reason]
            );
        }
        res.status(201).json({
            message: "Items Booked successfully",
        });

        
    } catch (error) {
        
        res.status(500).json({ message: "Booking failed, Try again..." });
    }
})

// get booking detail of user
 router.get('/items/user_booking/details/:phone', async (req, res) => {
  try {
    const { phone } = req.params;

    if (!db) {
      return res.status(500).json({ message: "Database not connected!!" });
    }

    if (!phone) {
      return res.status(400).json({ message: "Phone number required!!" });
    }

    // 🔹 Check if user exists
    const [rows] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User account not found!!" });
    }

    // 🔹 Query booking details for this user only
    const sql = `
      SELECT
        booked_details.booking_id,
        users.name as username,
        users.phone,
        items.item_id,
        items.name ,
        booked_details.item_quantity,
        booked_details.booked_date,
        booked_details.return_date,
        booked_details.reason,
        booked_details.status,
        booked_details.verify
      FROM booked_details
      JOIN users ON users.phone = booked_details.user_phone
      JOIN items ON items.item_id = booked_details.item_id
      WHERE booked_details.user_phone = ?  ORDER BY booked_details.booked_date DESC;
    `;

    const [bookingDetails] = await db.query(sql, [phone]);

    if (bookingDetails.length === 0) {
      return res.status(200).json({ message: "No bookings found", data: [] });
    }

    res.status(200).json({
      message: "Booking details fetched successfully",
      data:bookingDetails
    });

  } catch (error) {
    console.error("❌ Fetch booking error:", error);
    res.status(500).json({ message: "Failed to fetch booking details" });
  }
});
 

//update booking details by booking_id
router.patch('/items/user_booking/update_details/:bookingid',async(req,res)=>{
    try {
            
        if(!db){
            return res.status(500).json({message:"Database Not Connected!! Try again.."})
        }
        const {bookingid} = req.params;
        const { item_quantity, reason, status,returned_date } = req.body
        console.log(req.body)
        if(!bookingid){
            return res.status(404).json({  success: false,message:"Failed to select Booking details, Please select the booking item which want to be updated... "})
        }
        const [existing] = await db.query(
            "SELECT * FROM booked_details WHERE booking_id = ?",
            [bookingid]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                message: "Booking record not found! Try Again"
            });
        }
        const normalizedReturnDate = returned_date ? returned_date : null;
        const sql =`  UPDATE booked_details
            SET
                item_quantity = ?,
                reason = ?,
                status = ?,
                return_date =?
            WHERE booking_id = ? `
        await db.query(sql, [
            item_quantity,
            reason,
            status,
            normalizedReturnDate,
            bookingid
        ]);
        return res.status(200).json({
            success: true,
            message: "Booking details updated successfully!"
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update booking details..Try again later.." });
    }
})


//routers for admin view
//show items which status is booked
router.get("/items/view_allbooked_items",async(req,res)=>{

})

//show items which status is not return
router.get("/items/view_allnotreturn_items",async(req,res)=>{

})
//show items which status is cancelled
router.get("/items/view_allcancelled_items",async(req,res)=>{
  
})




export default router;