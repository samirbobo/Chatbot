import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import runChat from "../config/gemini";

const AuthUser = createContext(null);

const AuthProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  // const [allTasks, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reseltData, setReseltData] = useState("");
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const navigate = useNavigate();

  const login = async (userData) => {
    try {
      const response = await fetch("https://to-do-list.sintac.site/api/logIn", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body: JSON.stringify(userData),
      });
      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        navigate("/");
      }
    } catch (err) {
      console.log("Error in login api ", err);
      return err;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const onSent = async () => {
    setReseltData("");
    setLoading(true);
    setShowResult(true);
    setRecentPrompt(input);
    const response = await runChat(input);
    // البتاع بيقدر يستقبل مني صور كمان ويشرحها
    // ("https://code.visualstudio.com/assets/docs/languages/javascript/auto-import-after.png");
    console.log(response);
    setReseltData(response);
    setLoading(false);
    setInput("");
  };

  const values = {
    user,
    setUser,
    login,
    logout,
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    showResult,
    setShowResult,
    loading,
    setLoading,
    reseltData,
    setReseltData,
    onSent,
  };
  return <AuthUser.Provider value={values}>{children}</AuthUser.Provider>;
};
export default AuthProvider;

export const UseGlobalUser = () => {
  return useContext(AuthUser);
};
