import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

export const Footer = () => {
  return (
    <AntFooter
      style={{
        background: '#001529',
        color: 'white',
        textAlign: 'center',
        padding: '20px 50px',
        marginTop: 'auto',
      }}
    >
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={12} style={{ textAlign: 'center', marginBottom: '10px' }}>
          <Text style={{ color: '#fff' }}>
            © {new Date().getFullYear()} Inventory GSAGYS — All Rights Reserved.
          </Text>
        </Col>

        <Col xs={24} sm={12} style={{ textAlign: 'center' }}>
          <Text style={{ color: '#fff' }}>
            Designed and developed by  <span style={{ color: '#f19f06', fontWeight: 600 }}>NITUL SONOWAL</span>
          </Text>
        </Col>
      </Row>
    </AntFooter>
  );
};
