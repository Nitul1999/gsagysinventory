
import axiosInstance from "../apicalls/axiosInstance";
import React, { useEffect, useState } from "react";
import { Card, Typography, Row, Col, Divider,message } from "antd";
import {
  ContactsOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export const Contactpage = () => {
  const contacts = [
    {
      name: "Nitul Sonowal",
      designation: "System Developer & Technical Support",
      phone: "+91 8133820226",
      email: "nitulsonowal8133@gmail.com",
    },
    {
      name: "John Doe",
      designation: "Inventory Administrator",
      phone: "+91 9876543210",
      email: "admin@example.com",
    },
    {
      name: "Jane Smith",
      designation: "Committee Member",
      phone: "+91 9123456789",
      email: "committee@example.com",
    },
  ];
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
 const fetchMembers = async () => {
    try {
      const response = await axiosInstance.get("/users/contact/person");
      setMembers(response.data || []);
    } catch (error) {
      message.error("Unable to fetch members. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchMembers();
    }, []);
  


  return (
    <div
      style={{
        padding: "16px",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <Card bordered>
        <Title level={2} style={{ textAlign: "center" }}>
          <ContactsOutlined /> Contact Page
        </Title>

        <Paragraph
          style={{
            fontSize: 16,
            lineHeight: 1.8,
            textAlign: "justify",
          }}
        >
          If you have any questions regarding the Inventory Management System,
          booking process, or general enquiries, please feel
          free to contact any of the following persons.
        </Paragraph>

        <Divider orientation="left">Contact Persons</Divider>

        <Row gutter={[20, 20]}>
          {members.map((person, index) => (
            <Col xs={24} sm={24} md={12} lg={8} key={index}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  borderRadius: 10,
                }}
              >
                <p>
                  <UserOutlined /> <Text strong>Name:</Text> {person.name}
                </p>

                <p>
                  <IdcardOutlined /> <Text strong>Designation:</Text>{" "}
                  {person.designation}
                </p>

                <p>
                  <PhoneOutlined /> <Text strong>Phone:</Text> {person.phone}
                </p>

                <p style={{ wordBreak: "break-word", marginBottom: 0 }}>
                  <MailOutlined /> <Text strong>Email:</Text>{" "}
                  {person.email}
                </p>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        <Paragraph
          type="secondary"
          style={{
            textAlign: "center",
            fontSize: 15,
            marginBottom: 0,
          }}
        >
          We appreciate your feedback and are always ready to assist you. Please
          contact the appropriate person for any assistance related to the
          Inventory Management System.
        </Paragraph>
      </Card>
    </div>
  );
};