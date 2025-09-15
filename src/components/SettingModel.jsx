/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import CancelIcon from "../Icons/CancelIcon";
import BottomArowIcon from "../Icons/BottomArowIcon";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import DoneIcon from "../Icons/DoneIcon";
import DropdownItem from "./DropdownItem";
import DarkIcon from "../Icons/DarkIcon";
import LightIcon from "../Icons/LightIcon";

const SettingModel = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [openThemeDropdown, setOpenThemeDropdown] = useState(false);
  const [openLangDropdown, setOpenLangDropdown] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  const closeDropdowns = () => {
    setOpenThemeDropdown(false);
    setOpenLangDropdown(false);
  };

  const handleThemeSelect = (theme) => {
    setTheme(theme);
    closeDropdowns();
  };

  const handleLangSelect = (language) => {
    i18n.changeLanguage(language);
    setLanguage(language);
    closeDropdowns();
  };

  const handleOpenTheme = () => {
    setOpenThemeDropdown((prev) => !prev);
    setOpenLangDropdown(false);
  };

  const handleOpenLanguage = () => {
    setOpenLangDropdown((prev) => !prev);
    setOpenThemeDropdown(false);
  };

  const languages = {
    en: "English (US)",
    ar: "العربية",
    fr: "Français",
    es: "Español",
    de: "Deutsch",
  };

  return (
    <div className="back">
      <div className="allert setting">
        <div className="header-model">
          <h3>{t("general")}</h3>

          <i onClick={onClose}>
            <CancelIcon />
          </i>
        </div>

        <div className="setting-body-model">
          <div className="body-item">
            <p>{t("theme")}</p>

            <div className="relative">
              <button onClick={handleOpenTheme}>
                <span>{t(theme)}</span>
                <BottomArowIcon className="icon" />
              </button>

              {openThemeDropdown && (
                <ul className="dropdown">
                  <DropdownItem
                    className={`${theme === "light" && "active"} `}
                    onClick={() => handleThemeSelect("light")}
                    text={"light"}
                    value="light"
                    selected={theme}
                    icon={<DoneIcon />}
                    themeIcon={<LightIcon />}
                  />

                  <DropdownItem
                    className={`${theme === "dark" && "active"} `}
                    onClick={() => handleThemeSelect("dark")}
                    text={"dark"}
                    value="dark"
                    selected={theme}
                    icon={<DoneIcon />}
                    themeIcon={<DarkIcon />}
                  />
                </ul>
              )}
            </div>
          </div>

          <div className="body-item">
            <p>{t("language")}</p>

            <div className="relative">
              <button onClick={handleOpenLanguage}>
                <span>{languages[language]}</span>
                <BottomArowIcon className="icon" />
              </button>

              {openLangDropdown && (
                <ul className="dropdown">
                  {Object.entries(languages).map(([key, label]) => (
                    <DropdownItem
                      key={key}
                      className={`${language === key && "active"} `}
                      onClick={() => handleLangSelect(key)}
                      text={label}
                      value={key}
                      selected={language}
                      icon={<DoneIcon />}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingModel;
