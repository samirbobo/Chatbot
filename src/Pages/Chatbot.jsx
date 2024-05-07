import SearchIcon from "../Icons/SearchIcon";
import UploadImgIcon from "../Icons/UploadImgIcon";
import CopyIcon from "../Icons/CopyIcon";
import ChatbotIcon from "../Icons/ChatbotIcon";
import { UseGlobalUser } from "../auth/AuthUser";
import WariningIcon from "../Icons/WariningIcon";
import { Fragment, useEffect, useRef } from "react";
import avater from "../images/avater.png";

export default function Chatbot() {
  const {
    input,
    setInput,
    showResult,
    reseltData,
    onSent,
    scrollRef,
    scrollQuestion,
    loading,
    user,
  } = UseGlobalUser();
  const mesEnd = useRef(null);

  useEffect(() => {
    if (reseltData.length > 1)
      mesEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [scrollQuestion]);

  const handleCopyText = (e) => {
    const answerContent = e.target
      .closest(".answer")
      .querySelector(".answer-content").textContent;
    let showCopy = e.target.closest(".answer").querySelector(".show-copy");
    showCopy.innerHTML = "Copied";
    setTimeout(() => {
      showCopy.innerHTML = "Copy";
    }, 1000);
    navigator.clipboard.writeText(answerContent);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && input.question.trim().length > 1) {
      onSent();
    }
  };

  const handleHeight = (e) => {
    const textarea = e.target;
    if (textarea.scrollHeight > 47) {
      textarea.style.height = "auto";
      textarea.style.height = e.target.scrollHeight + "px";
    }
    if (textarea.value.trim() === "") {
      textarea.style.height = "47px"; // Set height to 47px when all text is removed
    }
    if (textarea.scrollHeight > 160) {
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }
  };

  const handleImageChange = (e) => {
    const img = URL.createObjectURL(e.target.files[0]);
    if (img) setInput({ ...input, image: img });
  };

  return (
    <section className="chatbot">
      <h2>How can I help you today?</h2>
      <p>enter your question to know the best answer</p>
      <div className="input-question">
        {input.image && (
          <img
            src={input.image}
            alt="Question-image"
            className="question-img"
          />
        )}
        <textarea
          className="input"
          placeholder="Message Chatbot..."
          value={input.question}
          disabled={loading}
          onChange={(e) => setInput({ ...input, question: e.target.value })}
          onKeyDown={handleEnter}
          style={{ height: input.question === "" && "47px" }}
          onKeyUp={handleHeight}
        ></textarea>
        {input.question.trim().length > 1 && !loading ? (
          <SearchIcon onClick={onSent} className="active" />
        ) : (
          <SearchIcon />
        )}
        <div className="container-upload-icon">
          {/* <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="upload-input"
          /> */}
          <UploadImgIcon className="edit bottom-icon" />
        </div>
        <div className="warning">
          <i>
            <WariningIcon />
          </i>
          <span>
            Please be more specific in your questions. Our chatbot may make
            mistakes.
          </span>
        </div>
      </div>
      {showResult && (
        <section className="chatbot-box">
          {reseltData.map((result, index) => (
            <Fragment key={index}>
              <article
                className="question"
                ref={reseltData.length > 1 ? mesEnd : null}
              >
                <img
                  src={
                    user?.image_path
                      ? `https://to-do-list.sintac.site/${user.image_path}`
                      : avater
                  }
                  alt="Avater"
                  className="person"
                />
                <p>{result.question}</p>
              </article>
              <article className="answer">
                <div className="answer-box">
                  <i>
                    <ChatbotIcon />
                  </i>
                  {result.loading ? (
                    <div className="loader"></div>
                  ) : (
                    <div
                      className="answer-content"
                      dangerouslySetInnerHTML={{ __html: result.answer }}
                    ></div>
                  )}
                </div>
                {!loading && (
                  <i>
                    <CopyIcon onClick={handleCopyText} />
                    <p className="show-copy">Copy</p>
                  </i>
                )}
              </article>
              <div ref={scrollRef}></div>
            </Fragment>
          ))}
        </section>
      )}
    </section>
  );
}
