import React from "react";
import { Layout, Row, Col, Space, Typography } from "antd";
import {
  MailOutlined,
  FacebookFilled,
  InstagramFilled,
  WhatsAppOutlined,
} from "@ant-design/icons";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export const Header = () => {
  return (
    <AntHeader
      style={{
        background: "#001529",
        padding: "1px 16px",
        height: "auto",
      }}
    >
      <Row align="middle" justify="space-between" wrap={false}>
        {/* LEFT SECTION */}
        <Col flex="auto">
          <Space>
            <MailOutlined style={{ color: "#40a9ff", fontSize: 16 }} />
            <Text style={{ color: "#fff" }}>support@gsagys.com</Text>
          </Space>
        </Col>

        {/* RIGHT SECTION */}
        <Col style={{ textAlign: "right" }}>
          <Space size="large">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FacebookFilled style={iconStyle} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <InstagramFilled style={iconStyle} />
            </a>
            <a href="https://wa.me/8133820226" aria-label="WhatsApp">
              <WhatsAppOutlined style={iconStyle} />
            </a>
          </Space>
        </Col>
      </Row>
    </AntHeader>
  );
};

const iconStyle = {
  color: "#fff",
  fontSize: 18,
};
