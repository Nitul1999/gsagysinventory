import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Table,
  Button,
  Tag,
  Spin,
  Input,
  Form,
  InputNumber,
  Modal,
  message,
  Select,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  AlertOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  PlusCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/images/mainlogo.png";

import axiosInstance from "../../apicalls/axiosInstance";

import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;
export const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [totalbooking, setTotalBooking] = useState(0);
  const [totalmember, setTotalMember] = useState(0);
  const [totalitem, setTotalItem] = useState(0);
  const [totalreturned, setTotalReturned] = useState(0);
  const [totalbooked, setTotalBooked] = useState(0);
  const [totalpending, setTotalPending] = useState(0);
  const [recentBookings, setRecentBookings] = useState();
  const [members, setMembers] = useState([]);
  const [, setSelectedMember] = useState(null);
  const [adminForm] = Form.useForm();

  const [, setItems] = useState([]);

  const [itemCostData, setItemCostData] = useState([]);
  const [totalInventoryCost, setTotalInventoryCost] = useState(0);
  const [costLoading, setCostLoading] = useState(false);
  const [itemSearch, setItemSearch] = useState("");

  const filteredItemCostData = itemCostData.filter((item) =>
    item.name.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [setadmin, setSetadmin] = useState(false);

  const [form] = Form.useForm();
  // const [, setSubmitting] = useState(false);
  const navigate = useNavigate();
  // Fetch Dashboard Data
  const totalBooking = async () => {
    try {
      const response = await axiosInstance.get(
        "/bookings/analysis/get_total_booking"
      );
      setTotalBooking(response.data.totalBookings);
    } catch (error) {
      console.error("Dashboard fetch failed", error);
    } finally {
      setLoading(false);
    }
  };
  const totalMember = async () => {
    try {
      const response = await axiosInstance.get(
        "/bookings/analysis/get_total_member"
      );
      setTotalMember(response.data.totalMember);
    } catch (error) {
      console.error("Dashboard fetch failed", error);
    } finally {
      setLoading(false);
    }
  };
  const totalItem = async () => {
    try {
      const response = await axiosInstance.get(
        "/bookings/analysis/get_total_items"
      );
      setTotalItem(response.data.totalItem);
    } catch (error) {
      console.error("Dashboard fetch failed", error);
    } finally {
      setLoading(false);
    }
  };
  const totalreturneditem = async () => {
    try {
      const response = await axiosInstance.get(
        "bookings/analysis/get_total_return_item"
      );
      setTotalReturned(response.data.totalReturns);
    } catch (error) {
      console.error("Dashboard fetch failed", error);
    } finally {
      setLoading(false);
    }
  };
  const totalbookeditems = async () => {
    try {
      const response = await axiosInstance.get(
        "bookings/analysis/get_total_booked_item"
      );
      setTotalBooked(response.data.totalBooked);
    } catch (error) {
      console.error("Booked Fetch Failed", error);
    } finally {
      setLoading(false);
    }
  };
  const totalpendingbooking = async () => {
    try {
      const response = await axiosInstance.get(
        "/bookings/analysis/get_total_pending_item"
      );
      setTotalPending(response.data.totalpending);
    } catch (error) {
      console.error("Dashboard fetch failed", error);
    }
  };
  const fetchMembers = async () => {
    try {
      const response = await axiosInstance.get("/users/view_normal_users");
      setMembers(response.data || []);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      // message.error("Unable to fetch members. Please try again later.");
    }
  };
  const fetchRecentbookings = async () => {
    try {
      const response = await axiosInstance.get(
        "/bookings/analysis/get_all/recent_booking"
      );
      setRecentBookings(response.data.recentbooking);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      // message.error("Unable to fetch members. Please try again later.");
    }
  };

  // fetch cost of each item
  const fetchItemCostSummary = async () => {
    try {
      setCostLoading(true);
      const res = await axiosInstance.get(
        "/bookings/analysis/items_price/total"
      );
      if (res.data.success) {
        setItemCostData(res.data.totalprice);
      }
    } catch (error) {
      // message.error("Failed to load item cost summary");
    } finally {
      setCostLoading(false);
    }
  };

  // fetch total inventory cost
  const fetchTotalInventoryCost = async () => {
    try {
      const res = await axiosInstance.get(
        "/bookings/analysis/item_total_cost/amount"
      );
      console.log(res);
      if (res.data.success) {
        setTotalInventoryCost(
          res.data.totalcost[0]?.total_inventory_value || 0
        );
      }
    } catch (error) {
      // message.error("Failed to load total inventory cost");
    }
  };
  const allitemlist = async () => {
    try {
      const response = await axiosInstance.get("/items/view_all_items");
      setItems(response.data || []);
    } catch (error) {
      console.error("Failed to fetch items:", error);
      message.error("Unable to fetch items. Please try again later.");
    }
  };

  useEffect(() => {
    totalBooking();
    totalMember();
    totalItem();
    totalreturneditem();
    totalbookeditems();
    totalpendingbooking();
    fetchMembers();
    fetchRecentbookings();
    fetchItemCostSummary();
    fetchTotalInventoryCost();
    allitemlist();
  }, []);

  // Table Columns
  const recentColumns = [
    { title: "Name", dataIndex: "user_name", key: "user_name" },
    {
      title: "Item",
      dataIndex: "item_name",
      key: "item_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "booked"
              ? "green"
              : status === "cancelled"
              ? "red"
              : "purple"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Booked Date",
      dataIndex: "booked_date",
      render: (d) => new Date(d).toLocaleDateString("en-GB"),
    },
    {
      title: "Verification",
      dataIndex: "verify",
      render: (val) =>
        val === 1 ? (
          <Tag color="blue">Verified</Tag>
        ) : (
          <Tag color="red">Pending</Tag>
        ),
    },
  ];
  //cost table cloumns
  const costColumns = [
    {
      title: "Sl.No",
      render: (_, __, index) => index + 1,
      width: 60,
    },
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total Quantity",
      dataIndex: "total_quantity",
      key: "total_quantity",
      align: "center",
    },
    {
      title: "Unit Price (₹)",
      dataIndex: "item_price",
      key: "item_price",
      align: "right",
      render: (v) => ` ${v.toLocaleString()}`,
    },
    {
      title: "Total Price (₹)",
      dataIndex: "total_item_price",
      key: "total_item_price",
      align: "right",
      render: (v) => ` ${v.toLocaleString()}`,
    },
  ];

  //add new items
  const handleModel = async () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const handleSubmit = async (values) => {
    try {
      const response = await axiosInstance.post("/items/add_new_item", values);
      if (response.data.success) {
        message.success(response.data?.message || "Item added successfully");
      } else {
        message.error(
          response.data?.message || "Failed to insert item..Try Again"
        );
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Password reset failed. Please try again."
      );
    } finally {
      setIsModalOpen(false);
      navigate("/items");
    }
  };
  //change member role
  const setadminmodel = () => {
    setSetadmin(true);
  };
  const handleCanceladmin = () => {
    setSetadmin(false);
    adminForm.resetFields();
  };
  const handleMemberSelect = (id) => {
    const user = members.find((m) => m.phone === id);

    adminForm.setFieldsValue({
      name: user.name,
      role: user.role,
    });
    setSelectedMember(user);
  };
  const handleCreateAdmin = async (values) => {
    try {
      const response = await axiosInstance.patch(
        "bookings/analysis/change/member-role",
        values
      );
      if (response.data.success) {
        message.success(response.data.message || "Updated..");
        fetchMembers();
        adminForm.resetFields();
      } else {
        message.error(response.data?.message || "Operation Failed..");
      }
    } catch (error) {
      message.error("Failed To Update..Try Again...");
    } finally {
      setSetadmin(false);
    }
  };

  //generate pdfs

  // Helper function to convert image to Base64
  const toBase64 = (url) =>
    fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })
      );

  const generateitemsummaryreportpdf = async () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      // 🔵 ADD BORDER AROUND ENTIRE PAGE
      doc.setDrawColor(33, 128, 141); // teal color
      doc.setLineWidth(0.3); // border thickness
      doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // x, y, width, height

      // let currentY = 15;

      // ------------------------------------------------------------------
      // 🔵 HEADER — Logo + Title + Date
      // ------------------------------------------------------------------

      // Add logo (top-left corner)
      const logoBase64 = await toBase64(logo);

      doc.addImage(logoBase64, "PNG", 3, -2, 40, 40);

      // Title (right of logo)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Grant Sologuri Agragami Yuva Sangha", pageWidth / 2, 12, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Item Summary Report", pageWidth / 2, 25, {
        align: "center",
      });

      // Date
      const generatedAt = new Date().toLocaleString("en-GB");
      doc.setFontSize(9);
      doc.text(`Generated on: ${generatedAt}`, pageWidth - 14, 25, {
        align: "right",
      });

      // ------------------------------------------------------------------
      // 🔵 SUMMARY BOX
      // ------------------------------------------------------------------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Inventory Item Details:", 14, 35);

      // Summary statistics
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        `Total Items: ${
          filteredItemCostData.length
        } | Total Value: ${totalInventoryCost.toLocaleString()}`,
        14,
        42
      );

      // ------------------------------------------------------------------
      // 🔵 TABLE
      // ------------------------------------------------------------------

      const tableData = filteredItemCostData.map((item, index) => [
        String(index + 1),
        item.name,
        String(item.total_quantity),
        item.item_price.toLocaleString(),
        item.total_item_price.toLocaleString(),
      ]);
      const chunkSize = 20;
      const tableChunks = [];
      for (let i = 0; i < tableData.length; i += chunkSize) {
        tableChunks.push(tableData.slice(i, i + chunkSize));
      }

      let startY = 50;

      tableChunks.forEach((chunk, index) => {
        if (index > 0) {
          doc.addPage();

          // draw page border again
          doc.setDrawColor(33, 128, 141);
          doc.setLineWidth(0.3);
          doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

          startY = 15;
        }

        autoTable(doc, {
          theme: "grid",
          startY,
          head: [
            ["Sl.No", "Item Name", "Total Qty", "Unit Price", "Total Price"],
          ],

          body: chunk,
          // startY: 50,

          // Only margins define table width
          margin: { left: 12, right: 12, top: 50 },

          styles: {
            fontSize: 9,
            cellPadding: 4,
            halign: "center",
            valign: "middle",
            lineWidth: 0.25,
            lineColor: [33, 128, 141],
          },

          headStyles: {
            fillColor: [33, 128, 141],
            textColor: 255,
            fontStyle: "bold",
          },

          columnStyles: {
            0: { cellWidth: 14 }, // Sl.No stays small
            1: { cellWidth: "auto" }, // auto-expands full width
            2: { cellWidth: 22 },
            3: { cellWidth: 28, halign: "right" },
            4: { cellWidth: 30, halign: "right" },
          },

          // alternateRowStyles: { fillColor: [245, 245, 245] },

          didDrawPage: (data) => {
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(8);
            doc.setTextColor(120);
            doc.text(
              `Page ${data.pageNumber} of ${pageCount}`,
              pageWidth / 2,
              pageHeight - 8,
              { align: "center" }
            );
          },
        });
      });

      // Save PDF
      const filename = `Item_Summary_Report_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(filename);

      message.success("PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      message.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}> 🔧 Admin Dashboard</Title>
      <Text type="secondary">
        Welcome to the GSAGYS Inventory Management Dashboard.
      </Text>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* TOP STAT CARDS */}
          <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
            <Col xs={12} sm={12} md={6}>
              <Card className="dash-card card-1 border-bottom">
                <Statistic
                  title="Total Bookings"
                  value={totalbooking}
                  prefix={<ShoppingCartOutlined />}
                />
                <p>
                  {" "}
                  <Link to={"/viewallbooking"}>View booking</Link>{" "}
                </p>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card className="dash-card card-2 border-bottom">
                <Statistic
                  title="Total Members"
                  value={totalmember}
                  prefix={<UserOutlined />}
                />
                <p>
                  {" "}
                  <Link to={"/member"}>View Members</Link>{" "}
                </p>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card className="dash-card card-4 border-bottom">
                <Statistic
                  title="Total Inventory Items"
                  value={totalitem}
                  prefix={<FolderOpenOutlined />}
                />
                <p>
                  {" "}
                  <Link to={"/items"}>View items</Link>{" "}
                </p>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card className="dash-card card-3 border-bottom">
                <Statistic
                  title="Total Returned Items"
                  value={totalreturned}
                  prefix={<SafetyCertificateOutlined />}
                />
                <p>
                  <Link to={"/returneditem"}>View Items </Link>
                </p>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card className="dash-card card-3 border-bottom">
                <Statistic
                  title="Total Not Returned Items"
                  value={totalbooked}
                  prefix={<AlertOutlined />}
                />
                <p>
                  {" "}
                  <Link to={"/viewnotreturnitem"}>View items</Link>
                </p>
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card className="dash-card card-3 border-bottom">
                <Statistic
                  title="Verfication pending"
                  value={totalpending}
                  prefix={<AlertOutlined />}
                />
                <p>
                  {" "}
                  <Link to={"/unverifyitem"}>View items</Link>
                </p>
              </Card>
            </Col>
          </Row>

          {/* QUICK ACTIONS */}
          <Card style={{ marginTop: 20 }}>
            <Title level={4}>⚡ Quick Actions</Title>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6} md={4}>
                <Button
                  block
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={() => handleModel()}
                >
                  New Item
                </Button>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Button
                  block
                  color="purple"
                  variant="filled"
                  icon={<PlusCircleOutlined />}
                  onClick={() => setadminmodel()}
                >
                  New Admin
                </Button>
              </Col>
              <Col xs={12} sm={6} md={4}>
                <Button
                  block
                  icon={<FileTextOutlined />}
                  onClick={generateitemsummaryreportpdf}
                >
                  Item Summary
                </Button>
              </Col>
            {/* <Col xs={12} sm={6} md={4}>
                <Button
                  block
                  icon={<FileTextOutlined />}
                  onClick={generateitemsummaryreportpdf}
                >
                  Booking Summary
                </Button>
              </Col> */}
            </Row>
          </Card>

          {/* RECENT BOOKINGS */}
          <Card style={{ marginTop: 20 }}>
            <Title level={4}>🕒 Recent Bookings</Title>
            <Table
              columns={recentColumns}
              dataSource={recentBookings}
              rowKey="id"
              pagination={{ pageSize: 8 }}
              scroll={{ x: 100 }}
              className="border"
            />
          </Card>

          {/* COST OF ALL ITEMS */}
          <Row gutter={[16, 10]} style={{ marginTop: 20 }}>
            {/* ITEM COST TABLE */}
            <Col xs={24} md={16}>
              <Card title="💰 Item-wise Cost Summary" className="border">
                <Input.Search
                  placeholder="Search item by name"
                  allowClear
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  style={{ maxWidth: 300, marginBottom: 6 }}
                />
                <Table
                  columns={costColumns}
                  dataSource={filteredItemCostData}
                  rowKey="item_id"
                  loading={costLoading}
                  pagination={{ pageSize: 8 }}
                  size="small"
                  scroll={{ x: true }}
                />
              </Card>
            </Col>

            {/* TOTAL INVENTORY COST */}
            <Col xs={24} md={8}>
              <Card
                bordered
                className="border"
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <Statistic
                  title={
                    <span style={{ fontSize: 18, fontWeight: 600 }}>
                      Total Inventory Value
                    </span>
                  }
                  value={totalInventoryCost}
                  prefix="₹"
                  precision={2}
                  valueStyle={{
                    color: "#3f8600",
                    fontSize: 30,
                    fontWeight: 600,
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* Add/Edit Modal */}
          <Modal
            title="Add New Item"
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            width={window.innerWidth < 500 ? "85%" : 600}
            style={{ top: 10 }} // ✅ 10px margin from top
            // okText={isEditing ? "Update" : "Add"}
          >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Item Name"
                name="name"
                rules={[{ required: true, message: "Enter item name" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Total Quantity"
                name="total_quantity"
                rules={[{ required: true, message: "Enter total quantity" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                label="Available Quantity"
                name="available_quantity"
                rules={[
                  { required: true, message: "Enter available quantity" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>

              <Form.Item
                label="Item Condition"
                name="item_condition"
                rules={[{ required: true, message: "Enter item condition" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Color" name="color">
                <Input />
              </Form.Item>

              <Form.Item
                label="Unit Price (₹)"
                name="item_price"
                rules={[{ required: true, message: "Enter price per unit" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
              </Form.Item>

              <Form.Item label="Description" name="description">
                <Input.TextArea rows={3} />
              </Form.Item>
            </Form>
          </Modal>

          {/* Add New Admin Modal */}
          <Modal
            title="Create New Admin"
            open={setadmin}
            onCancel={handleCanceladmin}
            onOk={() => adminForm.submit()}
            // okText={isEditing ? "Update" : "Add"}
          >
            <Form
              form={adminForm}
              layout="vertical"
              onFinish={handleCreateAdmin}
            >
              <Form.Item label="Member Name" name="phone">
                <Select
                  placeholder="Select Member"
                  style={{ width: "100%", padding: 0 }}
                  onChange={(value) => handleMemberSelect(value)}
                >
                  <Option value="">-- choose member --</Option>
                  {members.map((m) => (
                    <Option key={m.phone} value={m.phone}>
                      {m.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Role" name="role">
                <Select placeholder="Select New Role">
                  <Option value="user">User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
};
