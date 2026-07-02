import React, { useEffect, useState } from 'react';
import {Typography, Row, Col, Spin, message } from 'antd';

import axiosInstance from '../../apicalls/axiosInstance';
import { jwtDecode } from 'jwt-decode'; 
import { Profilecomp } from '../../component/usercomp/Profilecomp';

const {  Text } = Typography;

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Invaild Profile. Please log in again.');
          return;
        }

        const decoded = jwtDecode(token);
        const phone = decoded.phone || decoded?.data?.phone;
        console.log(phone)

        if (!phone) {
          message.error('Invalid session. Please log in again.');
          return;
        }

        const response = await axiosInstance.get(`/users/profile/${phone}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted) setUser(response.data);
      } catch (error) {
        console.error("❌ Profile fetch error:", error);
        const errMsg =
          error.response?.data?.message || "Failed to fetch user profile.";
        message.error(errMsg);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => (isMounted = false);
  }, []);

// ✅ Update profile API
  const handleUpdateProfile = async (updatedData) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('You are not logged in.');
        return;
      }

      const decoded = jwtDecode(token);
      const phone = decoded.phone || decoded?.data?.phone;

      const { data } = await axiosInstance.put(
        `/users/update/${phone}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success('Profile updated successfully ✅');
      setUser((prev) => ({ ...prev, ...updatedData })); // ✅ Update UI locally
      return data;
    } catch (error) {
      console.error("❌ Profile update error:", error);
      message.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };


  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '30vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '30vh' }}>
        <Text type="secondary">No profile data found</Text>
      </div>
    );
  }

  return (
    <Row justify="center" style={{ padding: '10px' }}>
      <Col xs={24} sm={20} md={12} lg={8}>
        <Profilecomp user={user} 
          onUpdateProfile={handleUpdateProfile} // 🔥 pass function here
          updating={updating}
        />
      </Col>
    </Row>
  );
};