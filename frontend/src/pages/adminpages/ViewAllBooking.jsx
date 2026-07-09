import React, { useEffect, useState } from "react";
import { Table, Tag, Button, message, Input, Select, Row, Col } from "antd";
import axiosInstance from "../../apicalls/axiosInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../stylesheet/Commonstyle.css";
import logo from "../../assets/images/mainlogo.png";

const { Search } = Input;
const { Option } = Select;

export const ViewAllBooking = () => {
  const [bookingData, setBookingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [selectedRows, setSelectedRows] = useState([]);

  // Fetch Bookings
  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get(
        "/bookings/analysis/get_all_bookings_details"
      );
      setBookingData(res.data.allbookings);
      setFilteredData(res.data.allbookings);
    } catch (error) {
      message.error("Failed to load booking list");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Search & Filter
  const applyFilters = (search, status) => {
    let data = bookingData;

    if (search) {
      data = data.filter(
        (b) =>
          (b.username &&
            b.username.toLowerCase().includes(search.toLowerCase())) ||
          (b.user_phone && b.user_phone.includes(search)) ||
          (b.itemname &&
            b.itemname.toLowerCase().includes(search.toLowerCase())) ||
          (b.reason && b.reason.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (status) {
      data = data.filter((b) => b.status === status);
    }

    setFilteredData(data);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    applyFilters(value, filterStatus);
  };

  const handleStatusFilter = (value) => {
    setFilterStatus(value);
    applyFilters(searchText, value);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };

  // Table Columns
  const columns = [
    {
      title: "Phone",
      dataIndex: "user_phone",
      sorter: (a, b) => a.user_phone.localeCompare(b.user_phone),
    },
    {
      title: "User Name",
      dataIndex: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Item Name",
      dataIndex: "itemname",
      sorter: (a, b) => a.itemname.localeCompare(b.itemname),
    },
    {
      title: "Item Qty",
      dataIndex: "item_quantity",
      sorter: (a, b) => a.item_quantity - b.item_quantity,
    },
    {
      title: "Booked Date",
      dataIndex: "booked_date",
      render: (date) => {
        if (!date) return "—";

        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        return <Tag color="blue">{`${day}-${month}-${year}`}</Tag>;
      },
      sorter: (a, b) => new Date(a.booked_date) - new Date(b.booked_date),
    },
    {
      title: "Return Date",
      dataIndex: "return_date",
      render: (date) => {
        if (!date) return "—";

        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        return <Tag color="blue">{`${day}-${month}-${year}`}</Tag>;
      },
      sorter: (a, b) => new Date(a.return_date) - new Date(b.return_date),
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
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
          {status.toUpperCase()}
        </Tag>
      ),
    },
    { title: "Reason", dataIndex: "reason" },
    {
      title: "Verify",
      dataIndex: "verify",
      render: (val) =>
        val === 1 ? (
          <Tag color="blue">Verified</Tag>
        ) : (
          <Button type="primary" size="small">
            Pending
          </Button>
        ),
    },
  ];

  //generate pdf
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
      return message.warning("Please select at least one booking.");
    }

    const selectedData = bookingData.filter((row) =>
      selectedRowKeys.includes(row.booking_id)
    );

    const logoBase64 = await toBase64(logo);

    const doc = new jsPDF("landscape", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 🔹 PAGE BORDER
    const drawBorder = () => {
      doc.setDrawColor(33, 128, 141);
      doc.setLineWidth(0.4);
      doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    };

    drawBorder();

    // 🔹 HEADER
    doc.addImage(logoBase64, "PNG", 5, -3, 55, 55);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(
      "Grant Sologuri Agragami Yuva Sangha Inventory System",
      pageWidth / 2,
      20,
      { align: "center" }
    );
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleString("en-GB")}`,
      pageWidth - 14,
      12,
      { align: "right" }
    );

    doc.setFontSize(12);
    doc.text(`Booking Details`, pageWidth / 2, 35, { align: "center" });

    // 🔹 TABLE
    autoTable(doc, {
      startY: 45,
      margin: { left: 12, right: 12 },
      theme: "grid",
      head: [
        [
          "Phone",
          "Name",
          "Item Name",
          "Qty",
          "Booked Date",
          "Status",
          "Reason",
          "Return Date",
        ],
      ],
      body: selectedData.map((item) => [
        item.user_phone,
        item.username,
        item.itemname,
        item.item_quantity,
        new Date(item.booked_date).toLocaleDateString("en-GB"),
        item.status.toUpperCase(),
        item.reason || "—",
        item.return_date
          ? new Date(item.return_date).toLocaleDateString("en-GB")
          : "—",
      ]),
      styles: { fontSize: 9, halign: "center", valign: "middle" },
      headStyles: {
        fillColor: [33, 128, 141],
        textColor: 255,
        fontStyle: "bold",
      },
      didDrawPage: () => drawBorder(),
    });

    // 🔹 FOOTER + TOTALS
    const totalQty = selectedData.reduce(
      (sum, i) => sum + Number(i.item_quantity || 0),
      0
    );
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.text(`Total Records: ${selectedData.length}`, 14, finalY);
    doc.text(`Total Quantity: ${totalQty}`, 14, finalY + 6);

    doc.setFont("helvetica", "bold");
    doc.text("Authorized Signature:", pageWidth - 90, finalY + 12);
    doc.line(pageWidth - 110, finalY + 14, pageWidth - 20, finalY + 14);
    doc.setFont("helvetica", "normal");
    doc.text("Inventory Incharge", pageWidth - 70, finalY + 20);

    // 🔹 PAGE NUMBERS
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pages}`, pageWidth / 2, pageHeight - 8, {
        align: "center",
      });
    }

    doc.save("Inventory_Booking_Report.pdf");
    message.success("PDF generated successfully!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📄 All Bookings</h2>

      {/* 🔍 Search + Filter Row */}
      <Row gutter={12} style={{ marginBottom: 15 }}>
        <Col xs={24} md={8}>
          <Search
            placeholder="Search by name / phone / item"
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            className="m-2"
          />
        </Col>

        <Col xs={24} md={6}>
          <Select
            placeholder="Filter by Status"
            style={{ width: "100%" }}
            allowClear
            onChange={handleStatusFilter}
            className="m-2"
          >
            <Option value="booked">Booked</Option>
            <Option value="returned">Returned</Option>
            <Option value="cancelled">Cancelled</Option>
          </Select>
        </Col>
        <Col xs={24} md={6}>
          <Button
            type="primary"
            onClick={generatePDF}
            disabled={selectedRowKeys.length === 0}
            style={{ marginTop: 3.3 }}
          >
            Generate PDF
          </Button>
        </Col>
      </Row>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        rowKey="booking_id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 700 }}
      />
    </div>
  );
};
