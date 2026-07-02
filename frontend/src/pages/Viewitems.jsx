import React, { useEffect, useState } from "react";
import { Table, Typography, Card, Spin, message } from "antd";
import axiosInstance from "../apicalls/axiosInstance";
import { jwtDecode } from "jwt-decode";
import { Itemcom } from "../component/itemcomp/Itemcom";

const { Title } = Typography;
export const Viewitems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userPhone,setUserPhone] =useState(null);
  // ✅ Fetch items from backend API
   const fetchItems = async () => {
      try {
        const response = await axiosInstance.get("/items/view_all_items");
        setItems(response.data || []);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        message.error("Unable to fetch items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
     // ✅ Decode user role from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserPhone(decoded.phone || decoded?.data?.phone ||null) ;     
        setUserRole(decoded.role || decoded?.data?.role || null);
      } catch (err) {
        console.error("Invalid token:", err);
        setUserRole(null);
      }
    }
  }, []);
  useEffect(() => {
    fetchItems();
  }, []);

 
  return (
    <div style={{ padding: "10px" }}>
      <Itemcom items={items}  userRole={userRole} userPhone={userPhone} loading={loading} refreshItems={fetchItems} />
    </div>
  );
}
