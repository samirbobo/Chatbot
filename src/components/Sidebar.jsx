import { NavLink } from "react-router-dom";
import ChatbotIcon from "../Icons/ChatbotIcon";
import GpaCalculator from "../Icons/GpaCalculator";
import ToDoListIcon from "../Icons/ToDoListIcon";
import SettingIcon from "../Icons/SettingIcon";
import LogoutIcon from "../Icons/LogoutIcon";
import avater from "../images/avater.png";
import SidebarIcon from "../Icons/SidebarIcon";
import LeftIcon from "../Icons/LeftIcon";
import RightIcon from "../Icons/RightIcon";
import { UseGlobalUser } from "../auth/AuthUser";
import PersonIcon from "../Icons/PersonIcon";

export default function Sidebar({ handleShowSidebar, openSidebar }) {
  const { logout, user } = UseGlobalUser();
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
            <p className="text">Chatbot</p>
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
        </nav>
      </div>
      <div className="sidebar-footer">
        <i>
          <PersonIcon />
        </i>
        <article className="footer-info text">
          <h4>{user.user.name}</h4>
          <p>{user.user.email}</p>
        </article>
      </div>
      <button className="arow-sidebar" onClick={handleShowSidebar}>
        {openSidebar ? <LeftIcon /> : <RightIcon />}
      </button>
    </aside>
  );
}
