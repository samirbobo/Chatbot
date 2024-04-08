// import { UseGlobalUser } from "../auth/AuthUser";
import SearchIcon from "../Icons/SearchIcon";
import PersonIcon from "../Icons/PersonIcon";
import CopyIcon from "../Icons/CopyIcon";
import ChatbotIcon from "../Icons/ChatbotIcon";
import { UseGlobalUser } from "../auth/AuthUser";

export default function Chatbot() {
  const {
    input,
    setInput,
    recentPrompt,
    // setRecentPrompt,
    showResult,
    // setShowResult,
    loading,
    // setLoading,
    reseltData,
    onSent,
  } = UseGlobalUser();

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
    if (e.key === "Enter" && input.trim().length > 1) {
      onSent();
    }
  };

  return (
    <section className="chatbot">
      <h2>How can I help you today?</h2>
      <p>enter your question to know the best answer</p>
      <div className="input-question">
        <input
          type="text"
          placeholder="Message Chatbot..."
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onKeyDown={handleEnter}
        />
        {input.trim().length > 1 ? (
          <SearchIcon onClick={onSent} className="active" />
        ) : (
          <SearchIcon />
        )}
      </div>
      {showResult && (
        <section className="chatbot-box">
          <article className="question">
            <i>
              <PersonIcon />
            </i>
            <p>{recentPrompt}</p>
          </article>
          <article className="answer">
            <div className="answer-box">
              <i>
                <ChatbotIcon />
              </i>
              {loading ? (
                <div className="loader"></div>
              ) : (
                <p
                  className="answer-content"
                  dangerouslySetInnerHTML={{ __html: reseltData }}
                ></p>
              )}
            </div>
            <i>
              <CopyIcon onClick={handleCopyText} />
              <p className="show-copy">Copy</p>
            </i>
          </article>
        </section>
      )}
    </section>
  );
}
