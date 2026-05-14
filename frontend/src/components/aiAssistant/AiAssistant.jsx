import { useState } from "react";
import { apiFetch } from "../../api";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

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
      const res = await apiFetch("/api/ai/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    <Box sx={{ position: "fixed", right: 24, bottom: 100 }}>
      {open && (
        <Card
          sx={{
            width: "320px",
            p: 2,
            mb: "12px",
            bgcolor: "white",
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",

            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6">AI Help Assistant</Typography>

          <Box
            sx={{
              maxHeight: "300px",
              overflowY: "auto",
              mb: "12px",
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  px: "12px",
                  py: "10px",
                  borderRadius: "12px",
                  mb: "8px",
                  fontSize: "14px",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  maxWidth: message.role === "user" ? "80%" : "85%",

                  ...(message.role === "user"
                    ? {
                        ml: "auto",
                        bgcolor: "#1f2937",
                        color: "white",
                      }
                    : {
                        mr: "auto",
                        bgcolor: "#f3f4f6",
                        color: "#111827",
                      }),
                }}
              >
                {message.text}
              </Box>
            ))}

            {loading && (
              <Box
                sx={{
                  px: "12px",
                  py: "10px",
                  borderRadius: "12px",
                  mb: "8px",
                  fontSize: "14px",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  maxWidth: "85%",
                  mr: "auto",
                  bgcolor: "#f3f4f6",
                  color: "#111827",
                }}
              >
                Thinking...
              </Box>
            )}
          </Box>

          <TextField
            fullWidth
            size="small"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askAI();
              }
            }}
            placeholder="Ask a question..."
          />

          <Button variant="contained" onClick={askAI} disabled={loading}>
            {loading ? "Thinking..." : "Ask"}
          </Button>
        </Card>
      )}

      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpen(!open)}
          sx={{ position: "fixed", right: 24, bottom: 24 }}
        >
          ASK
        </Fab>
      </Box>
    </Box>
  );
}
