/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";
import ToggleIcon from "../Icons/ToggleIcon";
import { UseGlobalUser } from "../auth/AuthUser";

const HeaderPage = ({ title, subTitle, className = "" }) => {
  const { t } = useTranslation();
  const { handleShowSidebar } = UseGlobalUser();

  return (
    <article className={`header-container ${className}`}>
      <button className="sidebar-icon" onClick={handleShowSidebar}>
        <ToggleIcon />
      </button>

      <div className="header-content">
        <h2>{t(title)}</h2>
        <p className="subtitle">{t(subTitle)}</p>
      </div>
    </article>
  );
};

export default HeaderPage;
