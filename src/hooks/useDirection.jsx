import i18next from "i18next";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useDirection() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", i18n.language);

    localStorage.setItem("lang", i18n.language);
  }, [i18n.language]);
}

export const reomveLanguage = () => {
  localStorage.removeItem("lang");
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("lang");
  i18next.changeLanguage("en");
};
