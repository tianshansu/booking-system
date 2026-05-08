import { useState } from "react";
import "./AiAssistant.css";

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I can help you understand how to use this admin booking system.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // send question to backend -> AI
  async function askAI() {
    // return if the msg is empty
    if (!question.trim() || loading) return;

    const userQuestion = question.trim();

    // show user's question in chat
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Please log in to use the AI assistant.",
          },
        ]);
        return;
      }

      const res = await fetch("/api/ai/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: userQuestion,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      // show AI answer in chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, the AI assistant is currently unavailable.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ai-box">
      {open && (
        <div className="ai-window">
          <h3>AI Help Assistant</h3>

          <div className="ai-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ai-message ai-message-${message.role}`}
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="ai-message ai-message-assistant">Thinking...</div>
            )}
          </div>

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askAI();
              }
            }}
            placeholder="Ask a question..."
          />

          <button onClick={askAI} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      )}

      <button className="ai-button" onClick={() => setOpen(!open)}>
        ASK
      </button>
    </div>
  );
}
