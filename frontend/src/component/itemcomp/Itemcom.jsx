import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Card,
  Spin,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Popconfirm,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../apicalls/axiosInstance";
import "../../stylesheet/Commonstyle.css";
const { Title } = Typography;
const { Option } = Select;

export const Itemcom = ({
  items,
  userRole,
  userPhone,
  loading,
  refreshItems,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false); // ✅ For booking modal
  const [bookingForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");
   const total = items.length
  //  console.log(total)
  // ✅ Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ Table Columns
  const columns = [
    {
      title: "SI No",
      dataIndex: "si",
      key: "si",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Item Number",
      dataIndex: "item_id",
      key: "item_id",
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
    },
    {
      title: "Available Quantity",
      dataIndex: "available_quantity",
      key: "available_quantity",
    },
    {
      title: "Item Conditions",
      dataIndex: "item_condition",
      key: "item_condition",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Unit Price",
      dataIndex: "item_price",
      key: "item_price",
      render: (price) => {
        const val = parseFloat(price);
        return isNaN(val) ? "—" : `₹ ${val.toFixed(2)}`;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
  ];

  // ✅ Only Admins can see Actions column
  if (userRole && (userRole === "admin" || userRole === "Admin")) {
    columns.push({
      title: "Actions",
      key: "actions",
      render: (record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={() => handleDelete(record.item_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    });
  }

  // ✅ Handle Add / Edit click
  const handleAddNew = () => {
    form.resetFields();
    setIsEditing(false);
    setEditItemId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditItemId(record.item_id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // ✅ Handle Delete
  const handleDelete = async (itemId) => {
    try {
      const response = await axiosInstance.delete(
        `/items/delete_item/${itemId}`
      );
      message.success(response.data?.message || "Item Deleted..");
      refreshItems();
    } catch (error) {
      console.error(error);
      message.error("Failed to delete item");
    }
  };

  // ✅ Submit Add/Edit form
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      let response;

      if (isEditing && editItemId) {
        response = await axiosInstance.put(
          `/items/update_item_details/${editItemId}`,
          values
        );
      } else {
        response = await axiosInstance.post("/items/add_new_item", values);
      }

      message.success(response.data?.message || "Operation successful!");
      setIsModalOpen(false);
      refreshItems();
    } catch (error) {
      console.error("❌ Item save error:", error);
      const errMsg =
        error.response?.data?.message ||
        "Failed to save item. Please try again.";
      message.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle Booking form submission
  const handleBookSubmit = async (values) => {
    try {
      if (!userPhone) {
        message.error("Please Logging First for Booking item");
      }
      const bookingData = {
        booked_items: values.booked_items.map((item) => ({
          item_id: item.item_id,
          item_quantity: item.quantity,
          reason: values.reason,
        })),
      };
      const response = await axiosInstance.post(
        `/booking/items/user_booking/${userPhone}`,
        bookingData
      );
      message.success(
        response?.data?.message || "Booking submitted successfully!"
      );
      setIsBookModalOpen(false);
      bookingForm.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Failed to submit booking");
    }
  };

  const filteredItems = items?.filter((item) =>
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Card
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      {/* Header + Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <Title
          level={3}
          style={{
            margin: 0,
            color: "#1890ff",
          }}
          className="m-3"
        >
          🧾 All Items <br />
          <span style={{ fontSize: 16,marginLeft:17,color:"black"}}> {`Total Item ${total}`}</span>
         
        </Title>

        <div>
          <Input
            placeholder="🔍 Search item by name..."
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 230, borderRadius: 8 }}
            className="m-3"
          />
          {/* ✅ Show Book Item only when logged in */}
          {isLoggedIn && (
            <Button
              color="purple"
              variant="solid"
              onClick={() => setIsBookModalOpen(true)}
              className="m-3"
            >
              Book Item
            </Button>
          )}

          {/* ✅ Add button only for Admins */}
          {userRole && (userRole === "admin" || userRole === "Admin") && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAddNew()}
              style={{ marginLeft: 10 }}
              className="m-3"
            >
              Add Item
            </Button>
          )}
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div style={{ textAlign: "center", margin: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredItems}
          pagination={{ pageSize: 15 }}
          rowKey={(record, index) => index}
          scroll={{ x: true }}
          bordered
          size="middle"
        />
      )}

      {/* ✅ Book Item Modal */}
      <Modal
        title="📦 Book Items"
        open={isBookModalOpen}
        onCancel={() => setIsBookModalOpen(false)}
        width={window.innerWidth < 500 ? "85%" : 600}
        onOk={() => bookingForm.submit()}
        okText="Submit Booking"
      >
        <Form
          form={bookingForm}
          layout="vertical"
          onFinish={handleBookSubmit}
          autoComplete="off"
        >
          <Form.List name="booked_items" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                      alignItems: "baseline",
                    }}
                    align="start"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "item_id"]}
                      label="Select Item"
                      rules={[{ required: true, message: "Select an item" }]}
                    >
                      <Select
                        style={{ width: 160 }}
                        placeholder="Select Item"
                        showSearch
                      >
                        {items.map((item) => (
                          <Option key={item.item_id} value={item.item_id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      label="Quantity"
                      rules={[{ required: true, message: "Enter quantity" }]}
                    >
                      <InputNumber min={1} style={{ width: 100 }} />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                      ></Button>
                    )}
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ width: 200 }}
                  >
                    Add More Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            label="Booking Reason"
            name="reason"
            rules={[{ required: true, message: "Booking Reason Required!" }]}
          >
            <Input min={1} style={{ width: "100%" }}></Input>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        title={isEditing ? "Edit Item" : "Add New Item"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={window.innerWidth < 500 ? "85%" : 600}
        style={{top: 10 }} // ✅ 10px margin from top
        okText={isEditing ? "Update" : "Add"}
        confirmLoading={submitting}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          // initialValues={{
          //   total_quantity: 0,
          //   available_quantity: 0,
          //   item_price: 0,
          // }}
        >
          {isEditing && (
            <Form.Item label="Item Number" name="item_id">
              <Input disabled />
            </Form.Item>
          )}
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
            rules={[{ required: true, message: "Enter available quantity" }]}
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
    </Card>
  );
};
