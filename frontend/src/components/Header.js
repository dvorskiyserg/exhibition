import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "rsuite";
import { MdLogin } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import AdminIcon from "@rsuite/icons/Admin";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, color } from "framer-motion";
import MenuIcon from "@rsuite/icons/Menu";
import CloseIcon from "@rsuite/icons/Close";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/index.css";

const languageIcons = { ua: "UA", en: "EN", de: "DE" };
const languageNames = { ua: "UA", en: "EN", de: "DE" };

const Header = () => {
  const { i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 880);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const getLoginIcon = () => {
    if (user) {
      const userRole = user.role?.toLowerCase();
      return (
        <AdminIcon
          style={{ fontSize: "18px", cursor: "pointer", marginBottom: "2" }}
          onClick={() =>
            navigate(userRole === "admin" ? "/admin/dashboard" : "/profile")
          }
        />
      );
    } else {
      return (
        <Link className="LoginLink" to="/login">
          <MdLogin size={22} style={{ cursor: "pointer", marginBottom: "2" }} />
        </Link>
      );
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 880);
      if (window.innerWidth >= 880) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className="preheader"
        style={{
          backgroundColor: "#f1f1f1",
          height: "30px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          position: "fixed",
          width: "100%",
          top: 0,
          zIndex: 1101,
          boxSizing: "border-box",
          padding: "0 40px",
          gap: "2em",
        }}
      >
        <a
          href="https://www.instagram.com/makoshethno.oficial/"
          target="_blank"
          rel="noopener noreferrer"
          className="insta-icon"
          style={{ color: "#333", fontSize: "20px", cursor: "pointer" }}
        >
          <FaInstagram />
        </a>

        {getLoginIcon()}

        <Dropdown
          placement="bottomEnd"
          renderToggle={(props, ref) => (
            <span
              ref={ref}
              {...props}
              style={{ cursor: "pointer", fontSize: "18px", color: "#3a215b" }}
            >
              {languageIcons[i18n.language]}
            </span>
          )}
          noCaret
        >
          {Object.keys(languageIcons).map((lng) => (
            <Dropdown.Item key={lng} onClick={() => changeLanguage(lng)}>
              {languageIcons[lng]}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>

      <Navbar
        appearance="inverse"
        className="custom-navbar"
        style={{ position: "fixed", top: "30px", width: "100%", zIndex: 1100 }}
      >
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <img src={logo} alt="Логотип" />
        </Navbar.Brand>

        {isMobile ? (
          <Nav>
            <Nav.Item onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <CloseIcon className="mobile_open-close_icon" />
              ) : (
                <MenuIcon className="mobile_open-close_icon" />
              )}
            </Nav.Item>
          </Nav>
        ) : (
          <Nav className="desktop-nav">
            <Nav.Item as={Link} to="/">
              Про нас
            </Nav.Item>
            <Nav.Item as={Link} to="/gallery">
              Галерея
            </Nav.Item>
            <Nav.Item as={Link} to="/">
              Виставки
            </Nav.Item>
            <Nav.Item as={Link} to="/profile">
              Учасникам
            </Nav.Item>
            <Nav.Item as={Link} to="/">
              Відвідувачам
            </Nav.Item>
            <Nav.Item as={Link} to="/contacts ">
              Контакти
            </Nav.Item>
          </Nav>
        )}
      </Navbar>

      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu"
            style={{
              position: "fixed",
              top: "86px",
              width: "100%",
              zIndex: 1099,
            }}
          >
            <Nav vertical style={{ width: "100%" }}>
              <Nav.Item as={Link} to="/" onClick={() => setIsOpen(false)}>
                Головна
              </Nav.Item>
              <Nav.Item
                as={Link}
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
              >
                Виставки
              </Nav.Item>
              <Nav.Item
                as={Link}
                to="/gallery"
                onClick={() => setIsOpen(false)}
              >
                Галерея
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
              <Nav.Item
                as={Link}
                to="/contacts"
                onClick={() => setIsOpen(false)}
              >
                Контакти
              </Nav.Item>
              <Nav.Item>{getLoginIcon()}</Nav.Item>
            </Nav>

            <div className="mobile-language-switcher">
              {Object.keys(languageNames).map((lng) => (
                <span
                  key={lng}
                  className={`language-link ${
                    i18n.language === lng ? "active" : ""
                  }`}
                  onClick={() => changeLanguage(lng)}
                >
                  {languageNames[lng]}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ paddingTop: "90px" }} />
    </>
  );
};

export default Header;
