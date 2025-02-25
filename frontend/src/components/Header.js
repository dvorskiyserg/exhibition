import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import i18n from "../i18n"; // Підключаємо i18n
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <header className="bg-header text-white h-16 p-4 flex items-center fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Логотип */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Логотип" className="h-7 w-auto" />
        </Link>

        {/* Навігація для великих екранів */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-amber-300 transition-colors">
            {t("header.home")}
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-amber-300 transition-colors"
          >
            {t("header.exhibitions")}
          </Link>
          <Link
            to="/profile"
            className="hover:text-amber-300 transition-colors"
          >
            {t("header.participants")}
          </Link>
          <Link
            to="/profile"
            className="hover:text-amber-300 transition-colors"
          >
            {t("header.visitors")}
          </Link>
          <Link
            to="/profile"
            className="hover:text-amber-300 transition-colors"
          >
            {t("header.about")}
          </Link>
          {user ? (
            <button
              onClick={logout}
              className="hover:text-amber-300 transition-colors"
            >
              {t("header.logout")}
            </button>
          ) : (
            <Link
              to="/login"
              className="hover:text-amber-300 transition-colors"
            >
              {t("header.login")}
            </Link>
          )}
        </nav>

        {/* Перемикач мов */}
        <div className="ml-4 flex items-center space-x-2">
          <button
            className={`${language === "ua" ? "font-bold" : ""}`}
            onClick={() => changeLanguage("ua")}
          >
            UA
          </button>
          <button
            className={`${language === "en" ? "font-bold" : ""}`}
            onClick={() => changeLanguage("en")}
          >
            EN
          </button>
          <button
            className={`${language === "de" ? "font-bold" : ""}`}
            onClick={() => changeLanguage("de")}
          >
            DE
          </button>
        </div>

        {/* Кнопка відкриття мобільного меню */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Мобільне меню з анімацією */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden text-white p-4 absolute top-16 left-0 w-full shadow-lg mobile-menu-color"
          >
            <ul className="flex flex-col space-y-4">
              <li>
                <Link
                  to="/"
                  className="block hover:text-amber-300 transition-colors"
                >
                  {t("header.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="block hover:text-amber-300 transition-colors"
                >
                  {t("header.exhibitions")}
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="block hover:text-amber-300 transition-colors"
                >
                  {t("header.participants")}
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="block hover:text-amber-300 transition-colors"
                >
                  {t("header.visitors")}
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="block hover:text-amber-300 transition-colors"
                >
                  {t("header.about")}
                </Link>
              </li>
              <li>
                {user ? (
                  <button
                    onClick={logout}
                    className="hover:text-amber-300 transition-colors"
                  >
                    {t("header.logout")}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="hover:text-amber-300 transition-colors"
                  >
                    {t("header.login")}
                  </Link>
                )}
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
