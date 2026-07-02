import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, message } from "antd";
import { CheckCircle} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../stylesheet/Homepage.css";
import mainsectionimage from "../assets/images/mainsectionimage.png";
import chooseus from "../assets/images/whychooseus.png";
import howwrok from "../assets/images/howwork.png";

import axiosInstance from "../apicalls/axiosInstance";

import '../stylesheet/Commonstyle.css'

export const Homepage = () => {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  const fetchstats = async () => {
    try {
      const bookingRes = await axiosInstance.get("/booking/total_booking");
      const usersRes = await axiosInstance.get("/users/total_user");
      const itemsRes = await axiosInstance.get("/items/view_total_items/all");

      setTotalBookings(bookingRes.data[0]["count(*)"] || 0);
      setTotalUsers(usersRes.data[0]["count(*)"] || 0);
      setTotalItems(itemsRes.data[0]["count(*)"] || 0);
    } catch (error) {
      console.log("Failed to fetch stats:", error);
    }
  };

  useEffect(() => {
    fetchstats();
  }, []);

  const handleBookNow = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.warning("Please login first to book an item.");
      navigate("/login");
      return;
    }

    navigate("/items"); // redirect to items page
  };

  return (
    <div>
      <div className="main-section">
        <motion.div
          className="main-image-section"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={mainsectionimage}
            alt="Inventory Graphic"
            className="hero-image"
          />
        </motion.div>

        <motion.div
          className="main-text-section"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1>Welcome to Inventory Management System</h1>
          <h3>Grant Sologuri Agragami Yuva Sangha</h3>
          <p>
            Easily book, manage, and track all inventory items with a modern and
            responsive interface.
          </p>

          <div className="booknowbtn">
           <div className="rotating-border">
            <Button
              type="primary"
              size="large"
              className="animated-btn"
              style={{ background: " #001529ff" }}
              onClick={handleBookNow}
            >
              Book Now
            </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* facility-section */}
      <div className="facility-section">
        <div className="facility-head">
          <h1>Our Key Facilities</h1>
          <p>
            Explore the core features that make our inventory system fast,
            efficient, and user-friendly.
          </p>
        </div>
        <div className="facility-section-sub">
          <motion.div
            className="facility-one"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>Easy Booking</h2>
            <p>Book inventory items with a user‑friendly interface.</p>
          </motion.div>

          <motion.div
            className="facility-one"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2>Real‑time Tracking</h2>
            <p>Track items live with updated status details.</p>
          </motion.div>

          <motion.div
            className="facility-one"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h2>Management Dashboard</h2>
            <p>Monitor all bookings and inventory in one place.</p>
          </motion.div>
        </div>
      </div>

      {/* important-section */}
      <div className="important-section">
        <div className="important-section-sub">
          <div className="important-section-text">
            <motion.div
              className="important-content"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <h1>Why Choose Our System?</h1>
              <p>
                Our platform is built to simplify your workflow — ensuring
                reliable booking, transparent tracking, and seamless management
                for all inventory activities. With automated updates, smart
                alerts, and an intuitive dashboard, you can easily monitor item
                availability, reduce manual errors, and improve overall
                efficiency. Whether you are managing small equipment or large
                organizational assets, our system provides the accuracy and
                control you need to stay organized and productive.
              </p>
            </motion.div>
          </div>
          <div className="important-section-image">
            <img src={chooseus} alt="Why Choose Us??"></img>
          </div>
        </div>
      </div>

      {/* ================= STATS SECTION ================= */}
      <div className="stats-section">
        <h1>Our Statistics</h1>
        <p>
          Trusted by users who rely on smooth and accurate inventory operations.
        </p>

        <div className="stats-grid">
          <motion.div
            className="stat-box"
            whileInView={{ scale: 1 }}
            initial={{ scale: 0.6 }}
            transition={{ duration: 0.6 }}
          >
            <h2>{totalBookings}+</h2>
            <p>Successful Bookings</p>
          </motion.div>

          <motion.div
            className="stat-box"
            whileInView={{ scale: 1 }}
            initial={{ scale: 0.6 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>{totalUsers}+</h2>
            <p>Active Users</p>
          </motion.div>

          <motion.div
            className="stat-box"
            whileInView={{ scale: 1 }}
            initial={{ scale: 0.6 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2>{totalItems}+</h2>
            <p>Inventory Items</p>
          </motion.div>
        </div>
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <div className="how-section">
        <div className="how-content">
          <h1>How It Works?</h1>
          <p>
            Our inventory process is designed to be simple, fast, and convenient
            for all users.
          </p>

          <div className="how-steps">
            <motion.div
              className="step"
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -40 }}
            >
              <CheckCircle size={40} />
              <h3>1. Create/Login Via Phone No</h3>
              <p>
                Access all features by logging in, or create an account
                instantly with your phone number.
              </p>
            </motion.div>
            <motion.div
              className="step"
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -40 }}
            >
              <CheckCircle size={40} />
              <h3>2. Browse Items</h3>
              <p>Select the item you want from our clean inventory list.</p>
            </motion.div>

            <motion.div
              className="step"
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -40 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle size={40} />
              <h3>3. Book Instantly</h3>
              <p>Choose a date and confirm your reservation in seconds.</p>
            </motion.div>

            <motion.div
              className="step"
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -40 }}
              transition={{ delay: 0.4 }}
            >
              <CheckCircle size={40} />
              <h3>4. Track Status</h3>
              <p>Monitor booking updates and item availability in real‑time.</p>
            </motion.div>
          </div>
        </div>

        <div className="how-image">
          <img src={howwrok} alt="How it works" />
        </div>
      </div>

      {/* ================= ABOUT SECTION ================= */}
      <div className="about-section" id="about">
        <div className="about-sub">
          <div className="about-text">
            <h1>About Us</h1>
            <p>
              Our organization is committed to improving community accessibility
              by providing a modern, well-structured system for managing shared
              inventory. We focus on transparency, automation, and user-friendly
              processes to ensure your experience is seamless. GSASYS (Grant
              Sologuri Agragami Yuva Sangha Inventory System) is designed to
              create a smooth connection between the people of our village and
              the Sangha’s available resources. This platform allows users to
              easily view, request, and access various items offered by the
              Sangha while ensuring clear availability details, proper tracking,
              and organized management of all assets. Our goal is to make
              community resources more accessible, efficient, and beneficial for
              everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
