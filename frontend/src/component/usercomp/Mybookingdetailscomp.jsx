import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Popconfirm,
  Modal,
  Form,
  InputNumber,
  Input,
  Select,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import {
  EditOutlined,
  DeleteOutlined,
  FileDoneOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/images/mainlogo.png";
import "../../stylesheet/Mybooking.css";

const { Option } = Select;

export const Mybookingdetailscomp = ({ bookings, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterStatus, setFilterStatus] = useState(undefined);

  const [form] = Form.useForm();

  // WATCH STATUS FIELD
  const statusValue = Form.useWatch("status", form);

  const openUpdateModal = (record) => {
    setEditRecord(record);
    form.setFieldsValue({
      item_quantity: record.item_quantity,
      reason: record.reason,
      status: record.status,
      returned_date:
        record.status === "returned" ? dayjs(record.returned_date) : null,
    });
    setIsModalOpen(true);
  };
  // Auto-set current date when status = returned
  useEffect(() => {
    if (statusValue === "returned") {
      form.setFieldsValue({
        returned_date: dayjs(),
      });
    } else {
      form.setFieldsValue({ returned_date: null });
    }
  }, [statusValue]);

  const handleUpdateSubmit = () => {
    form.validateFields().then((values) => {
      const updatedData = {
        booking_id: editRecord.booking_id,
        ...values,
        returned_date: values.returned_date
          ? values.returned_date.format("YYYY-MM-DD HH:mm:ss")
          : null,
      };

      onUpdate(updatedData)
        .then(() => {
          // Only close modal on success
          setIsModalOpen(false);
          form.resetFields();
        })
        .catch(() => {
          // Keep modal open on failure
          console.warn("Update failed — modal stays open.");
        });
    });
  };

  //search items
  const filteredBookings = bookings.filter((b) => {
    const search = searchText.toLowerCase();

    const itemName = b.name ? b.name.toLowerCase() : "";
    const reason = b.reason ? b.reason.toLowerCase() : "";
    const status = b.status ? b.status.toLowerCase() : "";

    const formattedDate = b.booked_date
      ? new Date(b.booked_date).toLocaleDateString("en-GB") // dd/mm/yyyy
      : "";

    // const formattedDate = b.booked_date
    // ? new Date(b.booked_date).toLocaleDateString("en-GB") // dd/mm/yyyy
    // : "";

    const matchesSearch =
      itemName.includes(search) ||
      reason.includes(search) ||
      formattedDate.includes(search) ||
      status.includes(search);

    const matchesStatus = filterStatus
      ? status === filterStatus.toLowerCase()
      : true;

    return matchesSearch && matchesStatus;
  });
  // 📌 COUNT BOOKING SUMMARY BASED ON STATUS
  const totalBookings = bookings.length;

  const totalReturned = bookings.filter(
    (b) => b.status?.toLowerCase() === "returned"
  ).length;

  const totalCancelled = bookings.filter(
    (b) => b.status?.toLowerCase() === "cancelled"
  ).length;

  const totalBooked = bookings.filter(
    (b) => b.status?.toLowerCase() === "booked"
  ).length;

  const columns = [
    { title: "Item ID", dataIndex: "item_id", key: "item_id" },
    { title: "Item Name", dataIndex: "name", key: "name" },
    { title: "Quantity", dataIndex: "item_quantity", key: "item_quantity" },
    {
      title: "Booking Date",
      dataIndex: "booked_date",
      key: "booked_date",
      render: (date) => {
        if (!date) return "—";

        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        return <Tag>{`${day}-${month}-${year}`}</Tag>;
      },
    },
    {
      title: "Booked By",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "booked"
            ? "green"
            : status === "cancelled"
            ? "red"
            : "purple";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Verified Status",
      dataIndex: "verify",
      key: "verify",
      render: (verify) => {
        const color = verify === 1 ? "green" : "red";
        const text = verify ? "Verified" : "Not Verified";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          {/* UPDATE BUTTON */}
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => openUpdateModal(record)}
          ></Button>
        </Space>
      ),
    },
    {
      title: "Returned Date",
      dataIndex: "return_date",
      key: "return_date",
      render: (date) => {
        if (!date) return "—";

        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        return <Tag color="blue">{`${day}-${month}-${year}`}</Tag>;
      },
    },
  ];

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
  const generatePDF = async () => {
    if (selectedRowKeys.length === 0) {
      return alert("Please select at least one booking to generate PDF.");
    }

    const selectedData = bookings.filter((row) =>
      selectedRowKeys.includes(row.booking_id)
    );

    // Convert Logo to Base64
    const logoBase64 = await toBase64(logo);

    // A4 Landscape
    const doc = new jsPDF("landscape", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ------------------------------------------------------------------
    // 🔵 HEADER — Logo + Title + Date
    // ------------------------------------------------------------------
    doc.addImage(logoBase64, "PNG", 3, -10, 55, 55);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(
      "Grant Sologuri Agragami Yuva Sangha's Inventory System",
      pageWidth / 2,
      20,
      { align: "center" }
    );

    const generatedAt = new Date().toLocaleString("en-GB");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${generatedAt}`, pageWidth - 14, 12, {
      align: "right",
    });

    // ------------------------------------------------------------------
    // 🔵 BOOKED BY + Subtitle
    // ------------------------------------------------------------------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Items Booked By: ${selectedData[0].username}`, 14, 42);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Your booking details are shown below:", 14, 50);

    // ------------------------------------------------------------------
    // 🔵 TABLE DATA SPLIT (Max 14 rows on Page 1)
    // ------------------------------------------------------------------
    const MAX_ROWS_FIRST_PAGE = 14;
    const firstPageRows = selectedData.slice(0, MAX_ROWS_FIRST_PAGE);
    const remainingRows = selectedData.slice(MAX_ROWS_FIRST_PAGE);

    const getReturnDate = (item) => {
      const d = item.return_date || item.returned_date;
      return d ? new Date(d).toLocaleDateString("en-GB") : "—";
    };

    let finalTableY = 0;

    // ------------------------------------------------------------------
    // 🔵 PAGE-1 TABLE (Max 14 rows)
    // ------------------------------------------------------------------
    autoTable(doc, {
      startY: 55,
      margin: { left: 14, right: 14 },
      pageBreak: "auto",

      tableLineWidth: 0.2,
      tableLineColor: [0, 0, 0],
      styles: {
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        halign: "center",
      },

      headStyles: {
        fillColor: [30, 30, 30],
        textColor: [255, 255, 255],
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
      },

      bodyStyles: {
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },

      head: [
        [
          "Item Name",
          "Quantity",
          "Booked Date",
          "Status",
          "Reason",
          "Return Date",
        ],
      ],

      body: firstPageRows.map((item) => [
        item.name,
        item.item_quantity,
        new Date(item.booked_date).toLocaleDateString("en-GB"),
        item.status,
        item.reason || "—",
        getReturnDate(item),
      ]),

      didDrawPage: (data) => {
        finalTableY = data.cursor.y;
      },
    });

    // ------------------------------------------------------------------
    // 🔵 REMAINING PAGES (Auto)
    // ------------------------------------------------------------------
    if (remainingRows.length > 0) {
      doc.addPage();

      autoTable(doc, {
        startY: 20,
        margin: { left: 14, right: 14 },
        pageBreak: "auto",
        tableLineWidth: 0.2,
        tableLineColor: [0, 0, 0],
        styles: {
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
          halign: "center",
        },

        headStyles: {
          fillColor: [30, 30, 30],
          textColor: [255, 255, 255],
          lineWidth: 0.3,
          lineColor: [0, 0, 0],
        },

        bodyStyles: {
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },

        head: [
          [
            "Item Name",
            "Quantity",
            "Booked Date",
            "Status",
            "Reason",
            "Return Date",
          ],
        ],

        body: remainingRows.map((item) => [
          item.name,
          item.item_quantity,
          new Date(item.booked_date).toLocaleDateString("en-GB"),
          item.status,
          item.reason || "—",
          getReturnDate(item),
        ]),

        didDrawPage: (data) => {
          finalTableY = data.cursor.y;
        },
      });
    }

    // ------------------------------------------------------------------
    // 🔵 FOOTER + SIGNATURE ONLY ON LAST PAGE
    // ------------------------------------------------------------------
    const totalPages = doc.internal.getNumberOfPages();
    doc.setPage(totalPages);

    const footerY = pageHeight - 24;

    doc.setFontSize(9);
    doc.text(`Page ${totalPages}`, 14, footerY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Terms & Conditions:", pageWidth / 2, footerY + 7, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      [
        "* The booked items must be returned in good condition.",
        "* Any loss or damage will be charged as per organization rules.",
        "* Bookings are subject to approval by the authorized committee.",
      ],
      pageWidth / 2,
      footerY + 14,
      { align: "center" }
    );

    // Signature
    const signatureY = pageHeight - 25;
    doc.setFontSize(12);
    doc.text("Signature:", pageWidth - 80, signatureY);
    doc.line(pageWidth - 120, signatureY + 1, pageWidth - 20, signatureY + 1);
    doc.setFontSize(10);
    doc.text("Authorized Person", pageWidth - 75, signatureY + 7);

    // ------------------------------------------------------------------
    // 🔵 SAVE PDF
    // ------------------------------------------------------------------
    doc.save("Inventory_Items_Booking_Details.pdf");
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };

  return (
    <>
      <div className="show-summary-container">
        <h1>Booking Summary</h1>
        <div className="booking-summary-card">
          <div className="card-total-booking">
            <FileDoneOutlined
              className="summary-icon"
              style={{ color: "#007bff" }}
            />
            <h3>Your Total Booking till date</h3>
            <p>{totalBookings}</p>
          </div>
          <div className="card-currenttotal-booking">
            <CalendarOutlined
              className="summary-icon"
              style={{ color: "#ffc107" }}
            />
            <h3>Your Active Bookings </h3>
            <p>{totalBooked}</p>
          </div>
          <div className="card-return-items">
            <CheckCircleOutlined
              className="summary-icon"
              style={{ color: "#28a745" }}
            />
            <h3>Total Return Items</h3>
            <p>{totalReturned}</p>
          </div>
          <div className="card-cancelled-items">
            <CloseCircleOutlined
              className="summary-icon"
              style={{ color: "#dc3545" }}
            />
            <h3>Total Booking Cancelled Items</h3>
            <p>{totalCancelled} </p>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          marginTop: 20,
        }}
      >
        {/* 🔍 Search Bar */}
        <Input
          placeholder="Search by Item Name, Booking Date (dd/mm/yyyy),Reason, or Status"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: "30%", border: "1px solid black" }} // adjust width as needed
        />
        <Select
          placeholder="Filter by Status"
          allowClear
          style={{ width: "20%" }}
          value={filterStatus}
          onChange={setFilterStatus}
          className="m-2"
        >
          <Option value="booked">Booked</Option>
          <Option value="returned">Returned</Option>
          <Option value="cancelled">Cancelled</Option>
        </Select>

        {/* 📄 Generate PDF Button */}
        <Button
          type="primary"
          onClick={generatePDF}
          disabled={selectedRowKeys.length === 0}
        >
          Generate PDF
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredBookings}
        rowKey={(record) => record.booking_id}
        pagination={{ pageSize: 20 }}
        bordered
        size="middle"
        scroll={{ x: true }}
        rowSelection={rowSelection}
      />
      {/* 🔷 UPDATE MODAL */}
      <Modal
        title="Update Booking"
        open={isModalOpen}
        onOk={handleUpdateSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Update"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Quantity"
            name="item_quantity"
            rules={[{ required: true, message: "Quantity is required!" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Booking Reason"
            name="reason"
            rules={[{ required: true, message: "Booking Reason required!" }]}
          >
            <Input min={1} style={{ width: "100%" }}></Input>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Select status!" }]}
          >
            <Select>
              <Select.Option value="Booked">Booked</Select.Option>
              <Select.Option value="returned">Returned</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Returned Date"
            name="returned_date"
            hidden={statusValue !== "returned"}
            rules={
              statusValue === "returned"
                ? [{ required: true, message: "Return date required!" }]
                : []
            }
          >
            <DatePicker
              style={{ width: "100%" }}
              disabled={statusValue !== "returned"}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
