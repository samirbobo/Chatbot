/* eslint-disable react/prop-types */
import { createContext, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import runChat from "../config/gemini";
import { chatbot } from "../APIS";
import ErrorAlert from "../components/ErrorAlert";
import {
  account,
  APPWRITE_BUCKET_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  avatars,
} from "../lib/appwrite";
import { ID } from "appwrite";
import { useTheme } from "../context/ThemeContext";
import { reomveLanguage } from "../hooks/useDirection";

const AuthUser = createContext(null);

const AuthProvider = ({ children }) => {
  const [input, setInput] = useState({ question: "", image: null });
  const [loginError, setLoginError] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reseltData, setReseltData] = useState([]);
  const [scrollQuestion, setScrollQuestion] = useState(false);
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { setTheme } = useTheme();

  const login = async (userData) => {
    try {
      await account.createEmailPasswordSession({
        email: userData.email,
        password: userData.password,
      });

      getInitialUserValue();
      setRegisterError(false);
      navigate("/");
    } catch (err) {
      console.log("Error in login api", {
        message: "الحساب غير موجود",
        status: false,
      });
      setLoginError(true);
      setUser(null);
      return err;
    }
  };

  const Register = async (userData) => {
    const { name, email, password } = userData;
    try {
      const response = await account.create({
        userId: ID.unique(),
        email,
        password,
        name,
      });

      console.log("User Registered:", response);
      await login(userData);
    } catch (err) {
      console.log("Error in login api", {
        message: "الحساب موجود بالفعل",
        status: false,
      });
      setRegisterError(true);
      setUser(null);
      return err;
    }
  };

  const getInitialUserValue = async () => {
    try {
      const response = await account.get();

      const newResponse = {
        ...response,
        image_path: avatars.getInitials({ name: response.name }).toString(),
      };

      localStorage.setItem("user", JSON.stringify(newResponse));
      setUser(newResponse);
    } catch (err) {
      console.log("Error in get Initial User", {
        message: "الحساب يحتوي علي مشكله",
        status: false,
      });
      setUser(null);
      return err;
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    await account.deleteSession({ sessionId: "current" });
    setUser(null);
    navigate("/login");
    setReseltData([]);
    setShowResult(false);
    setTheme("light");
    localStorage.removeItem("theme");
    reomveLanguage();
  };

  const getFileViewURL = (fileId) =>
    `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;

  async function handleResponse(response, number) {
    /* ===================== Chatbot Gemini ===================== */
    if (number === "one") {
      response +=
        "If the answer is wrong, rephrase the question more accurately or make sure the question is written correctly";
      // response = response.replace(/(Gemini|Gemine)/gi, "EduGuide");
      // response = response.replace(/Google/gi, "<b>Ahmed and Eslam</b>");
      response = response.replace(
        /\n\n\* \*\*(.*?)\*\*/g,
        "<br/><br />- <b>$1</b>"
      );
      response = response.replace(/\* \*\*(.*?)\*\*/g, "<br/><br/>- <b>$1</b>");

      response = response.replace(/\*\*(.*?)\*\*\n\n/g, "<b>$1</b><br/><br/>");

      response = response.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
      // Condition 3: If there is \n\n, only one new line is published and the words are placed in it
      response = response.replace(/\n\n/g, "<br/><br />");
      // Condition 4: If there is only one * and no ** behind it, only one new line will be displayed
      response = response.replace(/\* (.*?)\n/g, "<br />- $1");

      response = response.replace(
        /```([\w]+)([\s\S]*?)```/gs,
        `<article class="code-body"><code class="code"><pre class="pre-code">$2</pre></code></article>`
      );
    } else {
      /* ===================== Chatbot EduGuide ===================== */
      response = response.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" style="text-decoration: underline" target="_blank">$1</a>'
      );
      response = response.replace(/-\s/g, "");
      response = response.replace(/\n\n(\d+)\./g, "<br/><br />$1- ");
      response = response.replace(/\n(\d+)\./g, "<br/><br />$1- ");
      response = response.replace(/(\d+)\./g, "$1-");
      response = response.replace(/\n\n/g, "<br/><br />- ");
      response = response.replace(/\n/g, "<br/><br />- ");
    }

    const errorMessage =
      "If the answer is wrong, rephrase the question more accurately or make sure the question is written correctly";
    const replacementHTML = `<p>${errorMessage}</p>`;

    response = response.replace(
      new RegExp(errorMessage, "gi"),
      replacementHTML
    );

    let newResponseArray = response.split(" ");

    let delayCounter = 0; // Counter to track the number of delayed responses
    newResponseArray.forEach((item, index) => {
      delayCounter++;
      delayResponse(index, item + " ", () => {
        delayCounter--;
        if (delayCounter === 0) {
          // Call setLoading(false) when all responses have been processed
          setLoading(false);
          setInput({ question: "", image: null });
          setReseltData((prev) => [
            ...prev.slice(0, -1),
            {
              ...prev[prev.length - 1],
              copyLoading: true,
            },
          ]);
        }
      });
    });
  }

  const delayResponse = (index, nextWord, callback) => {
    setTimeout(() => {
      setReseltData((prev) => [
        ...prev.slice(0, -1),
        {
          ...prev[prev.length - 1],
          copyLoading: false,
          loading: false,
          answer: prev[prev.length - 1].answer + nextWord,
        },
      ]);

      if (callback) {
        callback(); // Execute the callback function
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }
    }, 75 * index);
  };

  const resetData = () => {
    setLoading(false);
    setReseltData((prev) => [...prev.slice(0, -1)]);
    if (reseltData.length < 1) {
      setShowResult(false);
    }
    ErrorAlert(
      "Please check your internet connection or there may be a server malfunction"
    );
  };

  const onSent = async () => {
    setLoading(true);
    setShowResult(true);
    setReseltData((prev) => [
      ...prev,
      {
        question: input.question,
        copyLoading: false,
        loading: true,
        answer: "",
      },
    ]);
    setScrollQuestion((prev) => !prev);
    /* ===================== Chatbot Gemini ===================== */
    if (input.image) {
      // const response = await runChat(input.question);
      try {
        const response = await runChat(input.image);
        handleResponse(response, "one");
      } catch (err) {
        resetData();
      }
    } else {
      /* ===================== Chatbot EduGuide ===================== */
      try {
        const response = await chatbot({ msg: input.question });
        const data = await response.json();
        console.log("EduGuide:", data.response);
        try {
          if (data.response === "Sorry, I didn't understand that.") {
            const response = await runChat(input.question);
            handleResponse(response, "one");
            return;
          }
          handleResponse(data.response, "two");
        } catch (err) {
          resetData();
        }
      } catch (err) {
        try {
          const response = await runChat(input.question);
          handleResponse(response, "one");
        } catch (err) {
          resetData();
        }
      }
    }
    // البتاع بيقدر يستقبل مني صور كمان ويشرحها
    // ("https://code.visualstudio.com/assets/docs/languages/javascript/auto-import-after.png");
  };

  const values = {
    user,
    setUser,
    login,
    loginError,
    setLoginError,
    logout,
    Register,
    setRegisterError,
    getInitialUserValue,
    registerError,
    input,
    setInput,
    showResult,
    setShowResult,
    loading,
    setLoading,
    reseltData,
    setReseltData,
    onSent,
    scrollRef,
    scrollQuestion,
    getFileViewURL,
    chatContainerRef,
  };
  return <AuthUser.Provider value={values}>{children}</AuthUser.Provider>;
};
export default AuthProvider;

export const UseGlobalUser = () => {
  return useContext(AuthUser);
};
