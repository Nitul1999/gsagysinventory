import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Typography,
  Button,
  Space,
  Popconfirm,
  Tag,
  message,
  Modal,
  Form,
  Input,
  Select,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../apicalls/axiosInstance";

import "../stylesheet/Member.css";

const { Title } = Typography;
const { Option } = Select;

export const Memberpage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [userRole, setUserRole] = useState("user"); // Default role is "user"
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();
  const [token, setToken] = useState(false);
  // ✅ Fetch all members
  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.get("/users/view_normal_users");
      setMembers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      message.error("Unable to fetch members. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const groupMembersByDesignation = () => {
    const grouped = {
      president: [],
      vice_President: [],
      secretary: [],
      treasurer: [],
      advisor: [],
      public_relations_office: [],
      event_coordinator: [],
      store_manager: [],
      member: [],
    };

    members.forEach((m) => {
      if (grouped[m.designation]) {
        grouped[m.designation].push(m);
      }
    });

    return grouped;
  };
  const designatedMembers = groupMembersByDesignation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Depending on your token structure
        const role = decoded?.role || decoded?.data?.role || "user";
        setUserRole(role);
      } catch (error) {
        setUserRole("user");
      }
    } else {
      setUserRole("user");
    }
    fetchMembers();
  }, []);

  // ✅ Handle Delete Member
  const handleDelete = async (phone) => {
    console.log(phone);
    try {
      const response = await axiosInstance.delete(
        `/users/delete_user_by_admin/${phone}`
      );
      message.success(response.data.message);
      fetchMembers();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete member.");
    }
  };

  // ✅ Handle Update Member Info (Open Modal)
  const handleUpdate = (member) => {
    setSelectedMember(member);
    form.setFieldsValue(member);
    setIsModalOpen(true);
  };

  // ✅ Submit Update Form
  const handleSubmit = async (values) => {
    try {
      const response = await axiosInstance.put(
        `/users/update_employee_by_admin/${selectedMember.phone}`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(response.data.message);
      setIsModalOpen(false);
      fetchMembers();
    } catch (error) {
      message.error("Failed to update member info.");
    }
  };

  // filterdata
  const filteredMembers = members.filter((m) => {
    const text = searchText.toLowerCase();

    return (
      m.name?.toLowerCase().includes(text) ||
      m.phone?.toString().includes(text) ||
      m.designation?.toLowerCase().includes(text) ||
      m.father_name?.toLowerCase().includes(text) ||
      m.email?.toLowerCase().includes(text)
    );
  });

  // ✅ Table Columns
  const columns = [
    {
      title: "Member Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text || "No Name",
    },
    {
      title: "Father Name",
      dataIndex: "father_name",
      key: "father_name",
      render: (text) => text || "Father Name Missing",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      responsive: ["xs", "sm", "md", "lg"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md", "lg"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role?.toLowerCase() === "admin" ? "red" : "blue"}>
          {role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (designation) => <Tag>{designation?.toLowerCase()}</Tag>,
    },
  ];
  if (userRole && (userRole === "admin" || userRole === "Admin")) {
    columns.push({
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Space size="small" wrap>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleUpdate(record)}
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.phone)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small">
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    });
  }
  return (
    <div style={{ padding: "20px" }}>
      <div className="como">
        <h1 className="page-title">
          <TeamOutlined className="title-icon" />
          Committee Members of GSAGYS
        </h1>
        <p className="page-subinfo">
          Below is the official list of designated committee members of
          <strong> Grant Sologuri Agragami Yuva Sangha (GSAGYS)</strong>. These
          members actively contribute towards event management, community
          development, inventory supervision and operational decisions.
        </p>

        <div className="designated-members">
          <div className="president designation-card">
            <h2 className="designation-title">President Of GSAGYS</h2>
            {designatedMembers.president.length > 0 ? (
              designatedMembers.president.map((m) => (
                <p key={m.phone}>
                  Name: {m.name} Contact:{m.phone}
                </p>
              ))
            ) : (
              <p>No president assigned</p>
            )}
          </div>

          <div className="vice-president designation-card">
            <h2 className="designation-title">Vice President Of GSAGYS</h2>
            {designatedMembers.vice_President.length > 0 ? (
              designatedMembers.vice_President.map((m) => (
                <p key={m.phone}>
                  Name: {m.name} Contact: {m.phone}
                </p>
              ))
            ) : (
              <p>No vice president assigned</p>
            )}
          </div>

          <div className="secretary designation-card">
            <h2 className="designation-title">Secretary Of GSAGYS</h2>
            {designatedMembers.secretary.length > 0 ? (
              designatedMembers.secretary.map((m) => (
                <p key={m.phone}>
                  Name: {m.name} Contact:{m.phone}
                </p>
              ))
            ) : (
              <p>No secretary assigned</p>
            )}
          </div>

          <div className="treasurer designation-card">
            <h2 className="designation-title">Treasurer Of GSAGYS</h2>
            {designatedMembers.treasurer.length > 0 ? (
              designatedMembers.treasurer.map((m) => (
                <p key={m.phone}>
                  Name: {m.name} Contact:{m.phone}
                </p>
              ))
            ) : (
              <p>No treasurer assigned</p>
            )}
          </div>

          <div className="advisor designation-card">
            <h2 className="designation-title">Advisor Of GSAGYS</h2>
            {designatedMembers.advisor.length > 0 ? (
              designatedMembers.advisor.map((m) => (
                <p key={m.phone}>
                  Name: {m.name} Contact:{m.phone}
                </p>
              ))
            ) : (
              <p>No advisor assigned</p>
            )}
          </div>

          <div className="public-relation-officer designation-card">
            <h2 className="designation-title">
              Public Relation Officer Of GSAGYS
            </h2>
            {designatedMembers.public_relations_office.length > 0 ? (
              designatedMembers.public_relations_office.map((m) => (
                <p key={m.phone}>
                  Name: {m.name} Contact:{m.phone}
                </p>
              ))
            ) : (
              <p>No PRO assigned</p>
            )}
          </div>

          <div className="event-coordinator designation-card">
            <h2 className="designation-title">Event Coordinator Of GSAGYS</h2>
            {designatedMembers.event_coordinator.length > 0 ? (
              designatedMembers.event_coordinator.map((m) => (
                <p key={m.phone}>
                  Name: {m.name} Contact:{m.phone}
                </p>
              ))
            ) : (
              <p>No event coordinator assigned</p>
            )}
          </div>

          <div className="store-manager designation-card">
            <h2 className="designation-title">Store Manager Of GSAGYS</h2>
            {designatedMembers.store_manager.length > 0 ? (
              designatedMembers.store_manager.map((m) => (
                <p key={m.phone}>
                  Name: {m.name} Contact:{m.phone}
                </p>
              ))
            ) : (
              <p>No store manager assigned</p>
            )}
          </div>
        </div>
      </div>
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <Title
          level={3}
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#1890ff",
          }}
        >
          👥 Others Members of GSAGYS
        </Title>

        {loading ? (
          <div style={{ textAlign: "center", margin: "50px 0" }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div
              style={{
                marginBottom: 15,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Input
                placeholder="Search by name, phone, designation..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 280 }}
                allowClear
              />
            </div>

            <Table
              columns={columns}
              dataSource={filteredMembers}
              rowKey={(record) => record.phone}
              pagination={{ pageSize: 10 }}
              bordered
              size="middle"
              scroll={{ x: true }}
            />
          </>
        )}
      </Card>

      {/* ✅ Update Modal */}
      <Modal
        title="Update Member Info"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
         style={{top: 10 }} 
        okText="Save"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={selectedMember}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter member name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Father Name" name="father_name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Designation" name="designation">
            <Select>
              <Option value="member">Member</Option>
              <Option value="president">President</Option>
              <Option value="vice_President">Vice President</Option>
              <Option value="secretary">Secretary</Option>
              <Option value="treasurer">Treasurer</Option>
              <Option value="advisor">Advisor</Option>
              <Option value="public_relations_office">
                Public relations office
              </Option>
              <Option value="event_coordinator">Event coordinator</Option>
              <Option value="store_manager">Store Manager</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
