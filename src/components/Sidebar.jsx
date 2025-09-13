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
import DarkIcon from "../Icons/DarkIcon";
import LightIcon from "../Icons/LightIcon";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ handleShowSidebar, openSidebar }) {
  const { logout, user, getFileViewURL } = UseGlobalUser();
  const { theme, setTheme } = useTheme();

  let userImage;
  if (user?.prefs?.profileImage) {
    userImage = getFileViewURL(user?.prefs?.profileImage);
  }

  const handleStatusMode = (mode) => {
    setTheme(mode);
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
            <p className="text">EduGuide</p>
          </NavLink>
          <NavLink to="/gpa-calculator" className="link">
            <i>
              <GpaCalculator />
            </i>
            <p className="text">GPA Calculator</p>
          </NavLink>
          <NavLink to="/to-do-list" className="link">
            <i>
              <ToDoListIcon />
            </i>
            <p className="text">To Do List</p>
          </NavLink>
          <NavLink to="/setting" className="link">
            <i>
              <SettingIcon />
            </i>
            <p className="text">Setting</p>
          </NavLink>
          <button className="link" onClick={logout}>
            <i>
              <LogoutIcon />
            </i>
            <p className="text">Log out</p>
          </button>

          <div className="container-mode">
            <div
              className={`mode ${theme === "light" && "active"}`}
              onClick={() => handleStatusMode("light")}
            >
              <i>
                <LightIcon />
              </i>
              <p>Light</p>
            </div>

            <div
              className={`mode ${theme === "dark" && "active"}`}
              onClick={() => handleStatusMode("dark")}
            >
              <i>
                <DarkIcon />
              </i>
              <p>Dark</p>
            </div>
          </div>
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
    </aside>
  );
}
