import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ua from "./locales/ua.json";
import en from "./locales/en.json";
import de from "./locales/de.json";

i18n.use(initReactI18next).init({
  resources: {
    ua: { translation: ua },
    en: { translation: en },
    de: { translation: de },
  },
  lng: "ua", // Мова за замовчуванням
  fallbackLng: "ua",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
