import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Анімація
import { useTranslation } from "react-i18next"; // i18next
import logo from "../assets/logo.png";
import { MdLogin } from "react-icons/md";

const languageIcons = {
  ua: "🇺🇦",
  en: "🇬🇧",
  de: "🇩🇪",
};

const Header = () => {
  const { i18n } = useTranslation(); // Використовуємо i18next
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);

  // Функція для зміни мови
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLangDropdown(false);
  };

  return (
    <header className="bg-header text-white h-16 p-4 flex items-center fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Логотип */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Логотип" className="h-7 w-auto" />
        </Link>

        {/* Навігація */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-amber-300 transition-colors">
            Головна
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-amber-300 transition-colors"
          >
            Виставки
          </Link>
          <Link
            to="/profile"
            className="hover:text-amber-300 transition-colors"
          >
            Учасникам
          </Link>
          <Link
            to="/profile"
            className="hover:text-amber-300 transition-colors"
          >
            Відвідувачам
          </Link>
          <Link
            to="/profile"
            className="hover:text-amber-300 transition-colors"
          >
            Про нас
          </Link>
          <Link to="/login" className="hover:text-amber-300 transition-colors">
            <MdLogin />
          </Link>

          {/* Випадаючий список мови */}
          <div className="relative">
            <button
              onClick={() => setLangDropdown(!langDropdown)}
              className="flex items-center text-xl"
            >
              {languageIcons[i18n.language]}{" "}
              <ChevronDown className="ml-1" size={16} />
            </button>

            {langDropdown && (
              <div className="absolute right-0 mt-2 w-20 bg-white text-black rounded-lg shadow-md">
                {Object.keys(languageIcons).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className="block px-4 py-2 text-xl w-full text-center hover:bg-gray-200"
                  >
                    {languageIcons[lng]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Кнопка мобільного меню */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Мобільне меню */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden text-white p-4 absolute top-16 left-0 w-full bg-header shadow-lg"
          >
            <ul className="flex flex-col space-y-4">
              <li>
                <Link to="/" onClick={() => setIsOpen(false)}>
                  Головна
                </Link>
              </li>
              <li>
                <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                  Виставки
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  Учасникам
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  Відвідувачам
                </Link>
              </li>
              <li>
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  Про нас
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <MdLogin />
                </Link>
              </li>
              <li className="relative">
                <button
                  onClick={() => setLangDropdown(!langDropdown)}
                  className="flex items-center text-xl"
                >
                  {languageIcons[i18n.language]}{" "}
                  <ChevronDown className="ml-1" size={16} />
                </button>
                {langDropdown && (
                  <div className="absolute left-0 mt-2 w-20 bg-white text-black rounded-lg shadow-md">
                    {Object.keys(languageIcons).map((lng) => (
                      <button
                        key={lng}
                        onClick={() => changeLanguage(lng)}
                        className="block px-4 py-2 text-xl w-full text-center hover:bg-gray-200"
                      >
                        {languageIcons[lng]}
                      </button>
                    ))}
                  </div>
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
