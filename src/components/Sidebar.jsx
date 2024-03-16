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

export default function Sidebar({ handleShowSidebar, openSidebar }) {
  const { logout } = UseGlobalUser();
  return (
    <aside className="sidebar">
      <div className="navigation">
        <div className="navigation-header">
          <SidebarIcon />
        </div>
        <nav className="navigation-menu">
          <NavLink to="/" className="link">
            <ChatbotIcon />
            {openSidebar && <p>Chatbot</p>}
          </NavLink>
          <NavLink to="/gpa-calculator" className="link">
            <GpaCalculator />
            {openSidebar && <p>GPA Calculator</p>}
          </NavLink>
          <NavLink to="/to-do-list" className="link">
            <ToDoListIcon />
            {openSidebar && <p>To Do List</p>}
          </NavLink>
          <NavLink to="/setting" className="link">
            <SettingIcon />
            {openSidebar && <p>Setting</p>}
          </NavLink>
          <button className="link" onClick={logout}>
            <LogoutIcon />
            {openSidebar && <p>Log out</p>}
          </button>
        </nav>
      </div>
      <div className="sidebar-footer">
        <div className="avater">
          <img src={avater} alt="avater" />
        </div>
        {openSidebar && (
          <article className="footer-info">
            <h4>Mona Mahmoud</h4>
            <p>mona@gmail.com</p>
          </article>
        )}
      </div>
      <button className="arow-sidebar" onClick={handleShowSidebar}>
        {openSidebar ? <LeftIcon /> : <RightIcon />}
      </button>
    </aside>
  );
}
