import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Dropdown, Container } from "rsuite";
import { MdLogin } from "react-icons/md";
import logo from "../assets/logo.png";
import MenuIcon from "@rsuite/icons/Menu";
import CloseIcon from "@rsuite/icons/Close";
import { useTranslation } from "react-i18next";

const languageIcons = {
  ua: "🇺🇦",
  en: "🇬🇧",
  de: "🇩🇪",
};

const Header = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Обробник зміни розміру вікна
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Navbar
      appearance="inverse"
      className="rs-header"
      style={{ position: "fixed", width: "100%", zIndex: 1000 }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="Логотип" style={{ height: "30px" }} />
        </Navbar.Brand>

        {/* Перемикач мобільного меню */}
        {isMobile && (
          <Nav pullRight>
            <Nav.Item onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </Nav.Item>
          </Nav>
        )}

        {/* Основна навігація */}
        {!isMobile && (
          <Nav pullRight>
            <Nav.Item as={Link} to="/">
              Головна
            </Nav.Item>
            <Nav.Item as={Link} to="/dashboard">
              Виставки
            </Nav.Item>
            <Nav.Item as={Link} to="/profile">
              Учасникам
            </Nav.Item>
            <Nav.Item as={Link} to="/profile">
              Відвідувачам
            </Nav.Item>
            <Nav.Item as={Link} to="/profile">
              Про нас
            </Nav.Item>
            <Nav.Item as={Link} to="/login" icon={<MdLogin />} />

            <Dropdown title={languageIcons[i18n.language]} noCaret>
              {Object.keys(languageIcons).map((lng) => (
                <Dropdown.Item key={lng} onClick={() => changeLanguage(lng)}>
                  {languageIcons[lng]}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </Nav>
        )}

        {/* Мобільне меню */}
        {isMobile && isOpen && (
          <div
            style={{
              position: "absolute",
              top: "60px",
              left: 0,
              width: "100%",
              background: "#fff",
              zIndex: 999,
              padding: "10px 0",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <Nav vertical>
              <Nav.Item as={Link} to="/" onClick={() => setIsOpen(false)}>
                Головна
              </Nav.Item>
              <Nav.Item
                as={Link}
                to="/dashboard"
                onClick={() => setIsOpen(false)}
              >
                Виставки
              </Nav.Item>
              <Nav.Item
                as={Link}
                to="/profile"
                onClick={() => setIsOpen(false)}
              >
                Учасникам
              </Nav.Item>
              <Nav.Item
                as={Link}
                to="/profile"
                onClick={() => setIsOpen(false)}
              >
                Відвідувачам
              </Nav.Item>
              <Nav.Item
                as={Link}
                to="/profile"
                onClick={() => setIsOpen(false)}
              >
                Про нас
              </Nav.Item>
              <Nav.Item as={Link} to="/login" onClick={() => setIsOpen(false)}>
                <MdLogin />
              </Nav.Item>
              <Dropdown title={languageIcons[i18n.language]} noCaret>
                {Object.keys(languageIcons).map((lng) => (
                  <Dropdown.Item key={lng} onClick={() => changeLanguage(lng)}>
                    {languageIcons[lng]}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </Nav>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
