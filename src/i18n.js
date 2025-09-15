import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";
import fr from "./locales/fr/translation.json";
import es from "./locales/es/translation.json";
import de from "./locales/de/translation.json";

const savedLang = localStorage.getItem("lang") || "en";
console.log(savedLang)

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
    fr: { translation: fr },
    es: { translation: es },
    de: { translation: de },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
