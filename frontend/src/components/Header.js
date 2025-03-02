import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Dropdown } from "rsuite";
import { MdLogin } from "react-icons/md";
import { useTranslation } from "react-i18next";
import MenuIcon from "@rsuite/icons/Menu";
import CloseIcon from "@rsuite/icons/Close";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
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
      <Navbar appearance="inverse" className="custom-navbar">
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
            <Nav.Item as={Link} to="/login">
              <MdLogin size={20} />
            </Nav.Item>
            {/* Dropdown з прапорцем для десктопу */}
            <Dropdown
              placement="bottomEnd"
              renderToggle={(props, ref) => (
                <span ref={ref} {...props} className="language-toggle">
                  {languageIcons[i18n.language] || "🌐"}
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
              <Nav.Item as={Link} to="/login" onClick={() => setIsOpen(false)}>
                <MdLogin size={20} />
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
