const express = require("express");
const chatSupportRoutes = express.Router();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

chatSupportRoutes.get("/help/stayNest/chat-support",(req,res)=>{
  res.render("chatSupport")
  console.log("API KEY:", process.env.OPENAI_API_KEY);

})
chatSupportRoutes.post("/api/chat-support", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("Incoming message:", message);


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
    console.error("AI Error:", error);
    res.status(500).json({
      reply: "Sorry, AI support is temporarily unavailable.",
    });
  }
});



module.exports = chatSupportRoutes;
