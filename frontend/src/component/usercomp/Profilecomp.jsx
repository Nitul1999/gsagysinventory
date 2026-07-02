import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Avatar,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import '../../stylesheet/Profile.css'

const { Title, Text } = Typography;

export const Profilecomp = ({ user = {}, onUpdateProfile, updating }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleEditClick = () => {
    form.setFieldsValue({
      name: user?.name || "",
      father_name: user?.father_name || "",
      phone: user?.phone || "",
      email: user?.email || "",
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (values) => {
    try {
      await onUpdateProfile(values);
      message.success("Profile updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      message.error("Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="profile-container">
      <Card
        style={{
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <Avatar
          size={70}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#ffc918ff", marginBottom: 16 }}
        />

        <Title level={3}>{(user?.name || "No Name").toUpperCase()}</Title>

        <hr />

        {/* <Text type="secondary">
          <UserOutlined /> {user?.father_name || "Father name not updated"}
        </Text> */}
        <br />
        <div className="pro-container-contact">
          <Text  className="text">
            <MailOutlined className="icon" /> {user?.email || "Email not updated"}
          </Text>

          <Text className="text">
            <PhoneOutlined className="icon"  /> {user?.phone || "No phone"}
          </Text>
        </div>
        <div className="pro-container-dgrole">
          <Text type="secondary" className="text">
            <UserOutlined  className="icon"/> Designation:{" "}
            {user?.designation?.toUpperCase() || "Not defined"}
          </Text>

          <Text type="secondary" className="text">
            <UserOutlined  className="icon"/> Role: {user?.role?.toUpperCase() || "Not defined"}
          </Text>
        </div>

        <div style={{ marginTop: 20 }}>
          <Space wrap>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>

            <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        </div>
      </Card>

      {/* ✅ Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Update"
        width={window.innerWidth < 500 ? "85%" : 600}
        confirmLoading={updating}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={{
            name: user?.name || "",
            father_name: user?.father_name || "",
            phone: user?.phone || "",
            email: user?.email || "",
          }}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item label="Father's Name" name="father_name">
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
            ]}
          >
            <Input prefix={<PhoneOutlined />} disabled />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input prefix={<MailOutlined />} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
