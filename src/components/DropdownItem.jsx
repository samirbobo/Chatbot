/* eslint-disable react/prop-types */
import { useTranslation } from "react-i18next";

const DropdownItem = ({
  className,
  onClick,
  text,
  value,
  selected,
  icon,
  themeIcon,
}) => {
  const { t } = useTranslation();

  return (
    <li className={className} onClick={onClick}>
      {themeIcon && (
        <div className="theme-icon">
          <i>{themeIcon}</i>
          <span>{t(text)}</span>
        </div>
      )}

      {!themeIcon && <span>{t(text)}</span>}

      {selected === value && <i>{icon}</i>}
    </li>
  );
};

export default DropdownItem;
