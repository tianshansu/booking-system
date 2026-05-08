const express = require("express");
const OpenAI = require("openai");
const adminSystemGuide = require("../docs/adminSystemGuide");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/help", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;

    // check whether the question has content
    if (!question || question.trim() === "") {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    // check question length
    if (question.length > 500) {
      return res.status(400).json({
        error: "Question is too long",
      });
    }

    // get response from ai
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      max_output_tokens: 400,
      input: [
        {
          role: "system",
          content: `
            You are a helpful AI assistant for this Admin Booking System.

            Only answer based on the system guide below.
            If the answer is not in the guide, say:
            "I do not have enough information about that in the system guide."

            System guide:
            ${adminSystemGuide}
          `,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    // return response
    return res.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error("AI help error:", error);

    return res.status(500).json({
      error: "Failed to generate AI answer",
    });
  }
});

module.exports = router;
