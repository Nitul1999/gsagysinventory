import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import itemRoutes from "./routers/item.js"; // note: .js extension required in ESM
import userRoute from "./routers/user.js"
import authRoutes from "./routers/auth.js"
import bookingRoutes from "./routers/booking.js"
import bookinganaRoutes from "./routers/admindashboard.js"

import db from "./dbconfig/dbconfig.js";


dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // your React app
  credentials: true,
}));
app.use(express.json());

// ✅ Uncomment this once your item router is ready
app.use("/ags/auth",authRoutes);
app.use("/ags/items", itemRoutes);
app.use("/ags/users",userRoute);
app.use("/ags/booking",bookingRoutes);
app.use("/ags/bookings/analysis",bookinganaRoutes)

const PORT = process.env.PORT || 5000;
// ✅ Start the server only if database connection works
async function startServer() {
  try {
    if (!db) throw new Error("Database pool not created");

    // Try a simple query to confirm connectivity
    await db.query("SELECT 1");
    console.log("✅ Database connection confirmed");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database not connected:", error.message);
    console.error("🛑 Server startup aborted due to DB connection failure");
    process.exit(1); // stop process
  }
}

startServer();
