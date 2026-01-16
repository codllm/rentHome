const express = require("express");
const OpenAI = require("openai");

const chatSupportRoutes = express.Router();

// Chat support page
chatSupportRoutes.get("/help/stayNest/chat-support", (req, res) => {
  console.log("API KEY:", process.env.OPENAI_API_KEY); 
  res.render("chatSupport");
});

// Chat API
chatSupportRoutes.post("/api/chat-support", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Incoming message:", message);

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        reply: "OPENAI_API_KEY not configured on server",
      });
    }

    // ✅ Create OpenAI client ONLY when needed
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openaiReply = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant for a vacation rental app. Help users with bookings, homes, and support.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: openaiReply.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({
      reply: "Sorry, AI support is temporarily unavailable.",
    });
  }
});

module.exports = chatSupportRoutes;
