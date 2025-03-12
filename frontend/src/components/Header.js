import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "rsuite";
import { MdLogin } from "react-icons/md";
import AdminIcon from "@rsuite/icons/Admin";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import MenuIcon from "@rsuite/icons/Menu";
import CloseIcon from "@rsuite/icons/Close";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/index.css";

const languageIcons = {
  ua: "🇺🇦",
  en: "🇬🇧",
  de: "🇩🇪",
};

const languageNames = {
  ua: "UA",
  en: "EN",
  de: "DE",
};

const Header = () => {
  const { i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 880);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  // const [langDropdown, setLangDropdown] = useState(false);

  // Функція для визначення іконки входу
  const getLoginIcon = () => {
    if (user) {
      const userRole = user.role?.toLowerCase(); // Перетворюємо роль у нижній регістр для надійності

      return (
        <AdminIcon
          style={{ fontSize: "18px", cursor: "pointer" }}
          onClick={() => {
            if (userRole === "admin") {
              navigate("/admin/dashboard");
            } else {
              navigate("/profile");
            }
          }}
        />
      );
    } else {
      return (
        <Link className="LoginLink" to="/login">
          <MdLogin size={22} style={{ cursor: "pointer" }} />
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
          padding: "0 20px",
          gap: "15px",
          position: "fixed",
          width: "100%",
          top: 0,
          zIndex: 1101,
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {getLoginIcon()}

          <Dropdown
            placement="bottomEnd"
            renderToggle={(props, ref) => (
              <span
                ref={ref}
                {...props}
                style={{ cursor: "pointer", fontSize: "20px" }}
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
      </div>

      <Navbar
        appearance="inverse"
        className="custom-navbar"
        style={{
          position: "fixed",
          top: "30px", // додано зміщення вниз
          width: "100%",
          zIndex: 1100, // має бути менше, ніж у preheader
        }}
      >
        {/* Лого зліва */}
        <Navbar.Brand as={Link} to="/" className="navbar-brand">
          <img src={logo} alt="Логотип" />
        </Navbar.Brand>

        {/* Навігація або кнопка меню */}
        {isMobile ? (
          <Nav>
            <Nav.Item onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </Nav.Item>
          </Nav>
        ) : (
          <Nav className="desktop-nav">
            <Nav.Item as={Link} to="/">
              Головна
            </Nav.Item>
            <Nav.Item as={Link} to="/admin/dashboard">
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
          </Nav>
        )}
      </Navbar>

      {/* Мобільне меню */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mobile-menu"
          >
            <Nav vertical style={{ width: "100%" }}>
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
              <Nav.Item>
                <div className="loginIcon">{getLoginIcon()}</div>
              </Nav.Item>
            </Nav>

            {/* Проста текстова мова у мобільному меню */}
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

      {/* Щоб контент не ховався під хедер */}
      <div className="page-content" />
    </>
  );
};

export default Header;
