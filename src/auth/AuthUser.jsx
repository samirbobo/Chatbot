import { createContext, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import runChat from "../config/gemini";
import { chatbot } from "../APIS";
import ErrorAlert from "../components/ErrorAlert";

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
        const { user } = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setLoginError(false);
        navigate("/");
      } else {
        throw {
          status: response.status,
        };
      }
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
    try {
      const response = await fetch(
        "https://to-do-list.sintac.site/api/signUp",
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
          body: JSON.stringify(userData),
        }
      );
      if (response.status === 200) {
        const { user } = await response.json();
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        setLoginError(false);
        navigate("/");
      } else {
        throw {
          status: response.status,
        };
      }
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

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    setReseltData([]);
    setShowResult(false);
  };

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
    const replacementHTML = `<p style="font-size: 14px;
    color: #ffa800;
    margin-top: 25px;
    display: block;">${errorMessage}</p>`;

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
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
      if (callback) {
        callback(); // Execute the callback function
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
  };
  return <AuthUser.Provider value={values}>{children}</AuthUser.Provider>;
};
export default AuthProvider;

export const UseGlobalUser = () => {
  return useContext(AuthUser);
};
