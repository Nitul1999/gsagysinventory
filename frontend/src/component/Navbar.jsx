import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer, Grid, Space, Dropdown } from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  AppstoreOutlined,
  TeamOutlined,
  LoginOutlined,
  UserOutlined,
  LogoutOutlined,
  HistoryOutlined,
  DashboardOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../stylesheet/Navbar.css";


const { Header } = Layout;
const { useBreakpoint } = Grid;

export const Navbar = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const screens = useBreakpoint();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIsLoggedIn(true);
          setUserRole(decoded.role || decoded?.data?.role || "user");
        } catch (error) {
          console.error("Invalid token:", error);
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };
    checkLogin(); // initial check
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setDrawerVisible(false);
    navigate("/login");
  };

  // ✅ Dropdown menu for all users
  const moreMenu = (
    <Menu>
     
      <Menu.Item key="contact">
        <Link to="/contact">Contact</Link>
      </Menu.Item>
      {/* <Menu.Item key="faq">
        <Link to="/faq">FAQ</Link>
      </Menu.Item> */}
      <Menu.Item key="support">
        <Link to="/support">Support</Link>
      </Menu.Item>
    </Menu>
  );

  const menuItems = [
    { key: "/", icon: <HomeOutlined />, label: <Link to="/">HOME</Link> },
    {
      key: "/items",
      icon: <AppstoreOutlined />,
      label: <Link to="/items">Items</Link>,
    },
    {
      key: "/member",
      icon: <TeamOutlined />,
      label: <Link to="/member">Member</Link>,
    },
    {
      key: "more",
      label: (
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown overlay={moreMenu} trigger={["hover"]}>
            <span style={{ cursor: "pointer" }}>
              More <DownOutlined style={{ fontSize: 10 }} />
            </span>
          </Dropdown>
        </div>
      ),
    },
    
  ];

  if (isLoggedIn && userRole?.toLowerCase() === "user") {
    menuItems.push({
      key: "/history",
      icon: <HistoryOutlined />,
      label: <Link to="/history">View History</Link>,
    });
  }
  if (isLoggedIn && userRole?.toLowerCase() === "admin") {
    menuItems.push({
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard </Link>,
    });
  }

  const isMobile = !screens.md; // below 768px (md breakpoint)

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#fff",
        padding: "0 16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Left: Logo */}
      <div
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#f19f06ff",
          flex: "0 0 auto",
        }}
      >
        Inventory GSAGYS
      </div>

      {/* Middle + Right (Desktop) */}
      {!isMobile ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{
              flex: "1",
              justifyContent: "center",
              borderBottom: "none",
              fontSize: "13px",
              background: "transparent",
            }}
          />
          {/* ✅ Auth-dependent buttons */}
          {!isLoggedIn ? (
            <Button
              icon={<LoginOutlined />}
              style={{
                marginLeft: "auto",
                background: "#001529",
                color: "white",
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          ) : (
            <Button
              type="default"
              icon={<UserOutlined />}
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
          )}
        </div>
      ) : (
        // Mobile menu button
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: 22 }} />}
          onClick={() => setDrawerVisible(true)}
        />
      )}

      {/* Drawer for Mobile Menu */}
      <Drawer
        title="Inventory GSAGYS"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={() => setDrawerVisible(false)}
        />
        {/* <div style={{ padding: '16px' }}>
                    <Button type="primary" block onClick={() => navigate('/login')}>
                        Login
                    </Button>
                </div> */}
        <div style={{ padding: "16px" }}>
          {!isLoggedIn ? (
            <Button
              icon={<LoginOutlined />}
              style={{
                marginLeft: "auto",
                background: "#001529",
                color: "white",
              }}
              onClick={() => {
                setDrawerVisible(false);
                navigate("/login");
              }}
            >
              Login
            </Button>
          ) : (
            <Space style={{ marginLeft: "auto" }}>
              <Button
                type="default"
                icon={<UserOutlined />}
                onClick={() => {
                  setDrawerVisible(false);
                  navigate("/profile");
                }}
              >
                Profile
              </Button>
              <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Button>
            </Space>
          )}
        </div>
      </Drawer>
    </Header>
  );
};
