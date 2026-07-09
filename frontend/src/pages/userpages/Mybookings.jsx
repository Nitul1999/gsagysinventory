import React, { useEffect, useState } from "react";
import {  Card, Typography,  Spin, message } from "antd";
import axiosInstance from "../../apicalls/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { Mybookingdetailscomp } from "../../component/usercomp/Mybookingdetailscomp";

const { Title } = Typography;

export const Mybookings = () => {
  const [bookings, setBookings] = useState([]);   // ✅ Always array
  const [loading, setLoading] = useState(true);
  const [userPhone, setUserPhone] = useState(null);

  // Decode user phone from token
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Login required to view bookings.");
        return;
      }

      const decoded = jwtDecode(token);
      setUserPhone(decoded.phone);

    } catch (error) {
      console.error("Token decode failed:", error);
    }
  }, []);

  // Fetch bookings
  const fetchBookings = async (phone) => {
    try {
      const response = await axiosInstance.get(
        `/booking/items/user_booking/details/${phone}`
      );

      const data = Array.isArray(response.data.data)
      ? response.data.data
      : [];

    setBookings(data);

    } catch (error) {
      console.error(error);
      message.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userPhone) fetchBookings(userPhone);
  }, [userPhone]);

  //upadte booking items
  const onUpdate=async(data)=>{
    try {
        const response = await axiosInstance.patch(
      `/booking/items/user_booking/update_details/${data.booking_id}`,
      data
    );

    if (response.data.success) {
      message.success("Booking updated successfully!");

      // Refresh updated booking list
      if (userPhone) {
        await fetchBookings(userPhone);
      }

      return Promise.resolve(); // so modal closes
    } else {
      message.error(response.data.message || "Failed to update booking");
      return Promise.reject(); // keep modal open
    }

    } catch (error) {
      console.error("Update booking error:", error);
      message.error("Something went wrong while updating.");
      return Promise.reject(error);
    }
  }

  return (
    <Card
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        marginTop: 20,
      }}
    >
      <Title level={2} style={{ textAlign: "center", color: "#1890ff" }}>
        📦 My Bookings Details
      </Title>
      {/* <Title level={5} style={{ textAlign: "center", color: "#a704cfff" }}>
         Manage You Boooked detail items
      </Title> */}

      {loading ? (
        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Mybookingdetailscomp bookings={bookings} onUpdate={onUpdate} />
      )}
    </Card>
  );
};
