import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext"; // Додаємо AuthContext
import logo from "../assets/logo.png";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); // Отримуємо користувача та функцію виходу
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Після виходу перенаправляємо на головну сторінку
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
          <Link
            to="/"
            className="hover:text-amber-300 transition-colors font-montserrat uppercase text-xs antialiased font-normal tracking-tight"
          >
            Головна
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-amber-300 transition-colors font-montserrat uppercase text-xs antialiased font-normal tracking-tight"
          >
            Виставки
          </Link>
          <Link
            to="/profile"
            className="hover:text-amber-300 transition-colors font-montserrat uppercase text-xs antialiased font-normal tracking-tight"
          >
            Учасникам
          </Link>
          <Link
            to="/profile"
            className="hover:text-amber-300 transition-colors font-montserrat uppercase text-xs antialiased font-normal tracking-tight"
          >
            Відвідувачам
          </Link>
          <Link
            to="/profile"
            className="hover:text-amber-300 transition-colors font-montserrat uppercase text-xs antialiased font-normal tracking-tight"
          >
            Про нас
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="hover:text-amber-300 transition-colors font-montserrat uppercase text-xs antialiased font-normal tracking-tight"
            >
              Вийти
            </button>
          ) : (
            <Link
              to="/login"
              className="hover:text-amber-300 transition-colors font-montserrat uppercase text-xs antialiased font-normal tracking-tight"
            >
              Увійти
            </Link>
          )}
        </nav>

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
                  className="block hover:text-amber-300 transition-colors font-montserrat uppercase text-sm antialiased font-normal tracking-tight"
                  onClick={() => setIsOpen(false)}
                >
                  Головна
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="block hover:text-amber-300 transition-colors font-montserrat uppercase text-sm antialiased font-normal tracking-tight"
                  onClick={() => setIsOpen(false)}
                >
                  Панель
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="block hover:text-amber-300 transition-colors font-montserrat uppercase text-sm antialiased font-normal tracking-tight"
                  onClick={() => setIsOpen(false)}
                >
                  Профіль
                </Link>
              </li>
              <li>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="block hover:text-amber-300 transition-colors font-montserrat uppercase text-sm antialiased font-black tracking-tight"
                  >
                    Вийти
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="block hover:text-amber-300 transition-colors font-montserrat uppercase text-sm antialiased font-normal tracking-tight"
                    onClick={() => setIsOpen(false)}
                  >
                    Увійти
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
