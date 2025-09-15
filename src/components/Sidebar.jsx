/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import ChatbotIcon from "../Icons/ChatbotIcon";
import GpaCalculator from "../Icons/GpaCalculator";
import ToDoListIcon from "../Icons/ToDoListIcon";
import SettingIcon from "../Icons/SettingIcon";
import LogoutIcon from "../Icons/LogoutIcon";
import SidebarIcon from "../Icons/SidebarIcon";
import LeftIcon from "../Icons/LeftIcon";
import RightIcon from "../Icons/RightIcon";
import { UseGlobalUser } from "../auth/AuthUser";
import avater from "../images/avater.png";
import { useTranslation } from "react-i18next";
import useDirection from "../hooks/useDirection";
import SettingModel from "./SettingModel";
import { useState } from "react";
import PersonIcon from "../Icons/PersonIcon";

export default function Sidebar({ handleShowSidebar, openSidebar }) {
  const { logout, user, getFileViewURL } = UseGlobalUser();
  const [openSetting, setOpenSetting] = useState(false);
  const { t } = useTranslation();
  useDirection();

  let userImage;
  if (user?.prefs?.profileImage) {
    userImage = getFileViewURL(user?.prefs?.profileImage);
  }

  const handleOpenSetting = () => {
    setOpenSetting(true);
  };

  const handleCloseSetting = () => {
    setOpenSetting(false);
  };

  return (
    <aside className={`sidebar ${openSidebar && "active"}`}>
      <div className="navigation">
        <div className="navigation-header">
          <SidebarIcon />
        </div>
        <nav className="navigation-menu">
          <NavLink to="/" className="link">
            <i>
              <ChatbotIcon />
            </i>
            <p className="text">{t("EduGuide")}</p>
          </NavLink>
          <NavLink to="/gpa-calculator" className="link">
            <i>
              <GpaCalculator />
            </i>
            <p className="text">{t("gpaCalculator")}</p>
          </NavLink>
          <NavLink to="/to-do-list" className="link">
            <i>
              <ToDoListIcon />
            </i>
            <p className="text">{t("todoList")}</p>
          </NavLink>
          <NavLink to="/setting" className="link">
            <i>
              <PersonIcon />
            </i>
            <p className="text">{t("profile")}</p>
          </NavLink>
          <button className="link" onClick={handleOpenSetting}>
            <i>
              <SettingIcon />
            </i>
            <p className="text">{t("setting")}</p>
          </button>
          <button className="link" onClick={logout}>
            <i>
              <LogoutIcon />
            </i>
            <p className="text">{t("logout")}</p>
          </button>
        </nav>
      </div>
      <div className="sidebar-footer">
        <img
          src={
            userImage ? userImage : user?.image_path ? user.image_path : avater
          }
          alt="Avater"
          className="person"
        />
        <article className="footer-info text">
          <h4>{user?.name}</h4>
          <p>{user?.email}</p>
        </article>
      </div>
      <button className="arow-sidebar" onClick={handleShowSidebar}>
        {openSidebar ? <LeftIcon /> : <RightIcon />}
      </button>

      {openSetting && <SettingModel onClose={handleCloseSetting} />}
    </aside>
  );
}
