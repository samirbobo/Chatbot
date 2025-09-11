/* eslint-disable react/prop-types */
import { useState } from "react";
import DeleteIcon from "../Icons/DeleteIcon";
import HideEyeIcon from "../Icons/HideEyeIcon";
import EyeIcon from "../Icons/EyeIcon";

export default function ConfirmPasswordModal({ onClose, onConfirm, loading }) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
          <h2 className="msg-sure">Confirm your password</h2>
        </div>
        <form onSubmit={handleSubmit} className="confirm-box">
          <label>
            Password
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            {showPassword ? (
              <HideEyeIcon onClick={handleClickShowPassword} />
            ) : (
              <EyeIcon onClick={handleClickShowPassword} />
            )}
          </label>
          {passwordError && (
            <p className="mes-error pass">Minimum 8 characters are required</p>
          )}
          <div className="bottom-allert">
            <button
              className="btn-sure delete"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="btn-sure cancel"
              type="submit"
              disabled={loading || !password}
            >
              Confirm
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
