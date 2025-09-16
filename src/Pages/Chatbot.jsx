import SearchIcon from "../Icons/SearchIcon";
// import UploadImgIcon from "../Icons/UploadImgIcon";
import CopyIcon from "../Icons/CopyIcon";
import ChatbotIcon from "../Icons/ChatbotIcon";
import { UseGlobalUser } from "../auth/AuthUser";
import WariningIcon from "../Icons/WariningIcon";
import { Fragment } from "react";
import avater from "../images/avater.png";
import { useTranslation } from "react-i18next";
import HeaderPage from "../components/HeaderPage";

export default function Chatbot() {
  const {
    input,
    setInput,
    showResult,
    reseltData,
    onSent,
    scrollRef,
    loading,
    user,
    getFileViewURL,
    chatContainerRef,
  } = UseGlobalUser();
  const { t } = useTranslation();

  let userImage;
  if (user?.prefs?.profileImage) {
    userImage = getFileViewURL(user?.prefs?.profileImage);
  }

  const handleCopyText = (e) => {
    const answerContentElement = e.target
      .closest(".answer")
      .querySelector(".answer-content");
    const answerContent = answerContentElement.textContent.replace(
      /If the answer is wrong, rephrase the question more accurately or make sure the question is written correctly/gi,
      ""
    );
    let showCopy = e.target.closest(".answer").querySelector(".show-copy");
    showCopy.innerHTML = t("copied");
    setTimeout(() => {
      showCopy.innerHTML = t("copy");
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

  // const handleImageChange = (e) => {
  //   const img = URL.createObjectURL(e.target.files[0]);
  //   if (img) setInput({ ...input, image: img });
  // };

  return (
    <section className="chatbot">
      <HeaderPage
        title={"chatbotHelpTitle"}
        subTitle={"chatbotHelpPlaceholder"}
      />
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
          placeholder={t("chatbotTitle")}
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
        {/* <div className="container-upload-icon">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="upload-input"
          />
          <UploadImgIcon className="edit bottom-icon" />
        </div> */}
        <div className="warning">
          <i>
            <WariningIcon />
          </i>
          <span>{t("chatbotWarning")}</span>
        </div>
      </div>
      {showResult && (
        <section className="chatbot-box" ref={chatContainerRef}>
          {reseltData.map((result, index) => (
            <Fragment key={index}>
              <article className="question">
                <img
                  src={
                    userImage
                      ? userImage
                      : user?.image_path
                      ? user.image_path
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
                {result.copyLoading && (
                  <i>
                    <CopyIcon onClick={handleCopyText} />
                    <p className="show-copy">{t("copy")}</p>
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
