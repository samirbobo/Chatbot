import { useState, useEffect } from "react";
import { UseGlobalUser } from "../auth/AuthUser";
import { Link, useNavigate } from "react-router-dom";
import SidebarIcon from "../Icons/SidebarIcon";
import EyeIcon from "../Icons/EyeIcon";
import HideEyeIcon from "../Icons/HideEyeIcon";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [userNameError, setUserNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { user, Register, registerError, setRegisterError } = UseGlobalUser();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    // If user is already logged in, redirect to home page
    setRegisterError(false);
    if (user) {
      navigate("/");
    }
  }, [user, navigate, setRegisterError]);

  const vaildation = () => {
    const { name, email, password, confirmPassword } = formData;
    const vaildEmail = /^[a-zA-Z][a-zA-Z0-9]*@gmail.com$/;
    const validName =
      /^([a-zA-Z][a-zA-Z0-9]*)(?!.*[-$#!@%^&*{}[()\]></?"_+=.~-])/;
    let isValid = true;
    if (!validName.test(name)) {
      setUserNameError(true);
      isValid = false;
    }
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
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vaildation()) return;
    setLoading(true);
    try {
      await Register(formData);
    } catch (err) {
      console.log("login page ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = ({ target }) => {
    const { name, value } = target;
    setFormData({ ...formData, [name]: value });
    if (name === "name") return setUserNameError(false);
    if (name === "email") return setEmailError(false);
    if (name === "password") return setPasswordError(false);
    if (name === "confirmPassword") return setConfirmPasswordError(false);
  };

  return (
    <section className="login sign-up">
      <article className="login-box">
        <div className="header-login">
          <SidebarIcon />
          <h1>Create your account</h1>
          <p>
            By registering you are agreeing to our Terms of use and privacy
            policy.
          </p>
          {registerError && (
            <p className="invaild-mes">Email already exists.</p>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              value={formData.name}
              name="name"
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
            {userNameError && <p className="mes-error">Invalid user name</p>}
          </label>
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
              value={formData.password}
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
          <label>
            Confirm Password
            <input
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              name="confirmPassword"
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
          {confirmPasswordError && (
            <p className="mes-error pass">The password does not match</p>
          )}
          <p className="text-account">
            Already have an account ? <Link to="/login">Log in</Link>
          </p>
          <button type="submit" className="submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : "Sign up"}
          </button>
        </form>
      </article>
    </section>
  );
}
