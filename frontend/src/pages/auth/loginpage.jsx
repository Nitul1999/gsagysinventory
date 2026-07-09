import React,{useState} from 'react'
import { Form, Input, Button, Row, Col, Typography, Card,Modal,message } from 'antd';
import { PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from "../../apicalls/axiosInstance"
const { Title } = Typography;


export const Loginpage = () => {

    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [, setLoading] = useState(false);
    const [forgotForm] = Form.useForm();

    //show forget password model
    const showModal = () => {
      setIsModalVisible(true);
    };
    const handleCancel = () => {
      setIsModalVisible(false);
      forgotForm.resetFields();
    };

    //login calls handler
    const onFinish =async (values) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/auth/login', values);

      // Show success and redirect
      message.success('Login successful!');
      // e.g., save token:
      localStorage.setItem('token', response.data.token);
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (error) {

      message.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    //forget password calls
    const onForgotFinish = async(values) => {
        console.log('Forgot Password Success:', values);

        try {
          // Make API request
          const response = await axiosInstance.post('/auth/forget-password', values);

          // Show success message from backend or fallback text
          message.success(response.data?.message || 'Password reset successful!');

          // Navigate after success
          navigate('/login');

          // Close modal and reset form
          setIsModalVisible(false);
          forgotForm.resetFields();
        } catch (error) {
      console.error('Forgot password error:', error);

      // Display error message from backend or default
      message.error(error.response?.data?.message || 'Password reset failed. Please try again.');
    }

    };

    const onForgotFinishFailed = (errorInfo) => {
      console.log('Forgot Password Failed:', errorInfo);
    };


  return (
    <Row justify="center" align="top" style={{ minHeight: '100vh', padding: '20px' }}>
      <Col xs={24} sm={16} md={12} lg={8} xl={6}>
        <Card style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
            Login
          </Title>
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
          <Form.Item
              name="phone"
              rules={[
                { required: true, message: 'Please enter valid phone number!' },
                { pattern: /^\d{10}$/, message: 'Please enter a valid phone number!' } // Basic validation for 10-15 digits
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Phone Number"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >

             <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Button style={{background:"#001529",color:"white"}} htmlType="submit" block size="large">
                Log In
              </Button>
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <button onClick={showModal} style={{ cursor: 'pointer' }}>Forgot password?</button> | <Link to={'/register'}> Register </Link>
            </Form.Item>
          </Form>
        </Card>
      </Col>


      <Modal
        title="Reset Password"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
       <Form
          form={forgotForm}
          name="forgotPassword"
          onFinish={onForgotFinish}
          onFinishFailed={onForgotFinishFailed}
          autoComplete="off"
        >

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Please input your phone number!' },
              { pattern: /^\d{10}$/, message: 'Please enter a valid phone number!' }
            ]}
          >
            <Input
              placeholder=" Phone Number"
              size="large"
            />
          </Form.Item>
             <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please input your new password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="New Password"
              size="large"
            />
          </Form.Item>
           <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
            />
          </Form.Item>
           <Form.Item>
            <Button  style={{background:"#001529",color:"white"}} htmlType="submit" block size="large">
              Reset Password
            </Button>
          </Form.Item>
        </Form>

      </Modal>
    </Row>
  )
}
