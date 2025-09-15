/* eslint-disable react/prop-types */
import { useState } from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import HideEyeIcon from "../Icons/HideEyeIcon";
import EyeIcon from "../Icons/EyeIcon";
import { useTranslation } from "react-i18next";

export default function ConfirmPasswordModal({ onClose, onConfirm, loading }) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim().length < 8) {
      setPasswordError(true);
      return;
    }
    onConfirm(password);
  };

  return (
    <div className="back">
      <div className="allert">
        <div className="top-allert">
          <DeleteIcon className="end-trash" size={40} />
          <h2 className="msg-sure">{t("confirmPassword")}</h2>
        </div>
        <form onSubmit={handleSubmit} className="confirm-box">
          <label>
            {t("password")}
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("enterPassword")}
              required
            />
            {showPassword ? (
              <HideEyeIcon onClick={handleClickShowPassword} />
            ) : (
              <EyeIcon onClick={handleClickShowPassword} />
            )}
          </label>
          {passwordError && (
            <p className="mes-error pass">{t("minCharacters")}</p>
          )}
          <div className="bottom-allert">
            <button
              className="btn-sure cancel"
              type="submit"
              disabled={loading}
            >
              {t("confirm")}
            </button>
            <button
              className="btn-sure delete"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              {t("cancel")}
            </button>
          </div>

          {loading && (
            <div className="container-loader">
              <div className="loader"></div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
