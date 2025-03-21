import React from "react";
import { Container, Sidebar, Sidenav, Nav, Content, Header } from "rsuite";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardIcon from "@rsuite/icons/List";
import GroupIcon from "@rsuite/icons/Peoples";
import NewsIcon from "@rsuite/icons/Detail";
import ImageIcon from "@rsuite/icons/Image";
import EmailIcon from "@rsuite/icons/Send";
import MediaIcon from "@rsuite/icons/Media";

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
                as={NavLink}
                to="/admin/dashboard"
                icon={<DashboardIcon className="admin-sidenav-icon" />}
              >
                Dashboard
              </Nav.Item>
              <Nav.Item
                as={NavLink}
                to="/admin/users"
                icon={<GroupIcon className="admin-sidenav-icon" />}
              >
                Користувачі
              </Nav.Item>

              <Nav.Item
                as={NavLink}
                to="/admin/slideredit"
                icon={<MediaIcon className="admin-sidenav-icon" />}
              >
                Слайдер
              </Nav.Item>

              <Nav.Item
                as={NavLink}
                to="/admin/news"
                icon={<NewsIcon className="admin-sidenav-icon" />}
              >
                Новини
              </Nav.Item>
              <Nav.Item
                as={NavLink}
                to="/admin/galleryedit"
                icon={<ImageIcon className="admin-sidenav-icon" />}
              >
                Галерея
              </Nav.Item>
              <Nav.Item
                as={NavLink}
                to="/admin/emails"
                icon={<EmailIcon className="admin-sidenav-icon" />}
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
