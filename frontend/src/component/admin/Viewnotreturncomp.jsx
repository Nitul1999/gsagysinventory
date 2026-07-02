import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Tag,
  Popconfirm,
  Input,
  DatePicker,
  Row,
  Col,
} from "antd";
import "../../stylesheet/Commonstyle.css";

const { RangePicker } = DatePicker;

export const Viewnotreturncomp = ({ data, onVerify, onVerifyall }) => {
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);

  // ----------- FILTERED DATA ----------
  const filteredData = useMemo(() => {
    return data?.filter((item) => {
      const s = searchText.toLowerCase();

      const matchSearch =
        item.user_name?.toLowerCase().includes(s) ||
        item.item_name?.toLowerCase().includes(s) ||
        item.reason?.toLowerCase().includes(s) ||
        item.phone?.toString().includes(s);

      let matchDate = true;
      if (dateRange) {
        const date = new Date(item.booked_date).getTime();
        const [start, end] = dateRange;
        matchDate =
          date >= new Date(start).getTime() && date <= new Date(end).getTime();
      }

      return matchSearch && matchDate;
    });
  }, [data, searchText, dateRange]);

  const hasBookingId = data?.some((item) => item.booking_id);
  const hasFatherName = data?.some((item) => item.father_name);
  const hasVerify = data?.some((item) => item.verify !== undefined);
  const hasreturndate = data?.some((item)=>item.return_date);
  // Table columns
  const columns = [
    { title: "Item Name", dataIndex: "item_name", key: "item_name" },
    { title: "Person Name", dataIndex: "user_name", key: "user_name" },
    { title: "Contact", dataIndex: "phone", key: "phone" },
    {
      title: "Booked Date",
      dataIndex: "booked_date",
      render: (d) => new Date(d).toLocaleDateString(),
    },
    { title: "Quantity", dataIndex: "item_quantity", key: "item_quantity" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
  ];
  // Conditionally push columns
  if (hasBookingId) {
    columns.unshift({
      title: "Booking ID",
      dataIndex: "booking_id",
      key: "booking_id",
    });
  }

  if (hasFatherName) {
    columns.splice(2, 0, {
      title: "Father Name",
      dataIndex: "father_name",
      key: "father_name",
    });
  }
  if (hasVerify) {
    const unverifiedIds = data
      ?.filter((item) => item.verify !== 1)
      .map((i) => i.booking_id);

    columns.push({
      title: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Verify</span>

          {unverifiedIds.length > 0 && (
            <Popconfirm
              title={`Verify all (${unverifiedIds.length}) items?`}
              okText="Yes"
              cancelText="No"
              onConfirm={() => onVerifyall(unverifiedIds, true)} // 2nd param to denote bulk verify
            >
              <Button size="small" type="primary" style={{ fontSize: 11 }}>
                Verify All
              </Button>
            </Popconfirm>
          )}
        </div>
      ),

      dataIndex: "verify",
      key: "verify",

      render: (v, record) =>
        v === 1 ? (
          <Tag color="green">Verified</Tag>
        ) : (
          <Popconfirm
            title="Verify this item?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onVerify(record.booking_id)} // single verify
          >
            <Button danger type="primary" size="small">
              Verify Now
            </Button>
          </Popconfirm>
        ),
    });
  }
  if(hasreturndate){
    columns.splice(5, 0, {
      title: "Return Date",
      dataIndex: "return_date",
         render: (d) => new Date(d).toLocaleDateString(),
    });
  }

  return (
    <div>
      <Row gutter={8} style={{ marginBottom: 15 }}>
        <Col xs={24} md={8}>
          <Input
            placeholder="Search by name / item / contact / reason"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="m-2"
            style={{ width: "80%" }}
          />
        </Col>

        {/* 📅 Date Range Filter */}
        <Col xs={24} md={12}>
          <RangePicker
            onChange={(dates) =>
              setDateRange(dates ? [dates[0], dates[1]] : null)
            }
            style={{ width: "50%" }}
            className="m-2"
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="booking_id"
        pagination={{ pageSize: 15 }}
        scroll={{ x: 700 }} // 📱 mobile swipe support
      />
    </div>
  );
};
