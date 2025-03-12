import React from "react";
import { Container, Sidebar, Sidenav, Nav, Header, Content } from "rsuite";
import { Link } from "react-router-dom";
import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import GroupIcon from "@rsuite/icons/legacy/Group";
import PageIcon from "@rsuite/icons/legacy/FileText";
import GearIcon from "@rsuite/icons/legacy/Gear";

const AppLayout = ({ children }) => {
  return (
    <Container>
      <Sidebar
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        width={260}
        collapsible
      >
        <Sidenav.Header>
          <div style={{ padding: 18, fontSize: 16, fontWeight: "bold" }}>
            Admin Dashboard
          </div>
        </Sidenav.Header>
        <Sidenav expanded={true}>
          <Sidenav.Body>
            <Nav>
              <Nav.Item
                as={Link}
                to="/admin/dashboard"
                icon={<DashboardIcon />}
              >
                Панель керування
              </Nav.Item>
              <Nav.Item as={Link} to="/admin/users" icon={<GroupIcon />}>
                Користувачі
              </Nav.Item>
              <Nav.Item as={Link} to="/admin/news" icon={<PageIcon />}>
                Новини
              </Nav.Item>
              <Nav.Item as={Link} to="/admin/settings" icon={<GearIcon />}>
                Налаштування
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </Sidebar>
      <Container>
        <Header style={{ padding: "15px", background: "#f7f7fa" }}>
          <h3>Адміністративна панель</h3>
        </Header>
        <Content style={{ padding: "20px" }}>{children}</Content>
      </Container>
    </Container>
  );
};

export default AppLayout;
