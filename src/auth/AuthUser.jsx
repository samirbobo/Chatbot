import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthUser = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("user") ? localStorage.getItem("user") : null
  );
  const navigate = useNavigate();

  const login = (userData) => {
    localStorage.setItem("user", userData);
    setUser(userData);
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const values = {
    user,
    setUser,
    login,
    logout,
  };
  return <AuthUser.Provider value={values}>{children}</AuthUser.Provider>;
};
export default AuthProvider;

export const UseGlobalUser = () => {
  return useContext(AuthUser);
};
