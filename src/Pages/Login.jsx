import { useState, useEffect } from "react";
import { UseGlobalUser } from "../auth/AuthUser";
import { Link, useNavigate } from "react-router-dom";
import SidebarIcon from "../Icons/SidebarIcon";
import EyeIcon from "../Icons/EyeIcon";
import HideEyeIcon from "../Icons/HideEyeIcon";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, loginError, setLoginError } = UseGlobalUser();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    // If user is already logged in, redirect to home page
    setLoginError(false);
    if (user) {
      navigate("/");
    }
  }, [user, navigate, setLoginError]);

  const vaildation = () => {
    const { email, password } = formData;
    const vaildEmail = /^[a-zA-Z][a-zA-Z0-9]*@gmail.com$/;
    let isValid = true;
    if (
      email.split("@")[0].length < 4 || // The number of letters in the name must be at least 5
      [...new Set(email.split("@")[0])].length <= 1 || //Test whether this name is a duplicate or a real name
      !vaildEmail.test(email) // I test whether the entire email contains the correct general form or not
    ) {
      setEmailError(true);
      isValid = false;
    }
    if (password.length < 6) {
      setPasswordError(true);
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vaildation()) return;
    setLoading(true);
    try {
      await login(formData);
    } catch (err) {
      console.log("login page ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
    if (name === "email") return setEmailError(false);
    if (name === "password") return setPasswordError(false);
  };

  return (
    <section className="login">
      <article className="login-box">
        <div className="header-login">
          <SidebarIcon />
          <h1>Welcome</h1>
          <p>Please log in to access the {"department's"} website</p>
          {loginError && (
            <p className="invaild-mes">Invaild Email or Password.</p>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={formData.email}
              name="email"
              onChange={handleInputChange}
              placeholder="Example@gmail.com"
              required
            />
            {emailError && (
              <p className="mes-error">Invalid email enter example@gmail.com</p>
            )}
          </label>
          <label>
            Password
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleInputChange}
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
            <p className="mes-error pass">Minimum 6 characters are required</p>
          )}
          <p className="text-account">
            {"Don't"} have an account? <Link to="/register">Sign up</Link>
          </p>
          <button type="submit" className="submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Log in"}
          </button>
        </form>
      </article>
    </section>
  );
}
