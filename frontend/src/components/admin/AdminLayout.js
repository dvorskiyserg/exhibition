// src/components/admin/AdminLayout.js
import React from "react";
import { Container, Sidebar, Sidenav, Nav, Content, Header } from "rsuite";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardIcon from "@rsuite/icons/List";
import GroupIcon from "@rsuite/icons/Peoples";
import NewsIcon from "@rsuite/icons/Detail";
import ImageIcon from "@rsuite/icons/Image";
import EmailIcon from "@rsuite/icons/Send";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") {
    navigate("/profile");
  }

  return (
    <Container className="dashboard-container">
      <Sidebar style={{ width: 250 }}>
        <Sidenav defaultOpenKeys={["3", "4"]} appearance="subtle">
          <Sidenav.Body>
            <Nav>
              <Nav.Item
                icon={<DashboardIcon className="admin-sidenav-icon" />}
                href="/admin/dashboard"
              >
                Панель керування
              </Nav.Item>
              <Nav.Item
                icon={<GroupIcon className="admin-sidenav-icon" />}
                href="/admin/users"
              >
                Користувачі
              </Nav.Item>
              <Nav.Item
                icon={<NewsIcon className="admin-sidenav-icon" />}
                href="/admin/news"
              >
                Новини
              </Nav.Item>
              <Nav.Item
                icon={<ImageIcon className="admin-sidenav-icon" />}
                href="/admin/gallery"
              >
                Галерея
              </Nav.Item>
              <Nav.Item
                icon={<EmailIcon className="admin-sidenav-icon" />}
                href="/admin/emails"
              >
                Розсилка
              </Nav.Item>
              <Nav.Item onClick={logout}>Вийти</Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </Sidebar>
      <Container>
        <Header>
          <h4>Панель адміністратора</h4>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Container>
    </Container>
  );
};

export default AdminLayout;
