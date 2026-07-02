import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Typography, Card, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../apicalls/axiosInstance';

const { Title } = Typography;

export const Registrationpage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // handle registration submit
  const onFinish = async (values) => {
    try {
      setLoading(true);
      console.log('Register values:', values);

      // Example API call
      const response = await axiosInstance.post('/auth/register', values);
      message.success(response.data.message || 'Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error.response?.data?.message || 'Registration failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row justify="center" align="top" style={{ minHeight: '100vh', padding: '10px' }}>
      <Col xs={24} sm={16} md={12} lg={8} xl={6}>
        <Card style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
            Register
          </Title>

          <Form
            name="register"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {/* Name */}
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter your name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Name" size="large" />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter your phone number!' },
                { pattern: /^\d{10}$/, message: 'Phone number must be 10 digits!' },
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number" size="large" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="example@email.com" size="large" />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Enter password" size="large" />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm password"
                size="large"
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                style={{background:"#001529",color:"white"}}
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                Register
              </Button>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center' }}>
              Already have an account? <Link to="/login">Login</Link>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
