import React from "react";
import { Card, Typography, Row, Col, Divider } from "antd";
import {
  CustomerServiceOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export const Supportpage = () => {
  return (
    <div
      style={{
        padding: "16px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <Card
        bordered
        style={{
          borderRadius: 10,
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <CustomerServiceOutlined /> Support Page
        </Title>

        <Paragraph
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            textAlign: "justify",
          }}
        >
          Welcome to the <strong>Inventory Management System Technical Support</strong>.
          If you experience any issues while using the application, such as
          login problems, booking errors, report generation issues, data
          inconsistencies, or any other technical difficulties, please contact
          our support team. We are committed to providing prompt assistance to
          ensure the smooth operation of the system.
        </Paragraph>

        <Divider orientation="left">
          Technical Support Contact
        </Divider>

        <Row justify="center">
          <Col xs={24} sm={22} md={18} lg={14} xl={12}>
            <Card
              style={{
                borderRadius: 8,
              }}
            >
              <p style={{ marginBottom: 15 }}>
                <UserOutlined />{" "}
                <Text strong>Support Person:</Text> Nitul Sonowal
              </p>

              <p style={{ marginBottom: 15 }}>
                <PhoneOutlined />{" "}
                <Text strong>Mobile:</Text> +91 8133820226
              </p>

              <p style={{ marginBottom: 15 }}>
                <PhoneOutlined />{" "}
                <Text strong>Alternate Mobile:</Text> +91 9101233239
              </p>

              <p style={{ marginBottom: 0, wordBreak: "break-word" }}>
                <MailOutlined />{" "}
                <Text strong>Email:</Text>{" "}
                nitulsonowal8133@gmail.com
              </p>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Paragraph
          type="secondary"
          style={{
            textAlign: "justify",
            fontSize: 15,
          }}
        >
          <strong>Support Hours:</strong> Monday to Saturday (9:00 AM – 6:00 PM)
          <br />
          For urgent technical issues outside working hours, please send an
          email with a detailed description of the problem, including
          screenshots if possible. Our support team will respond as soon as
          possible.
        </Paragraph>
      </Card>
    </div>
  );
};