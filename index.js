import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Allow your frontend site
app.use(
  cors({
    origin: "https://cryptoincognito555.github.io",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash-lite",
    });

    // 🧠 Build a witty personality prompt
    const prompt = `
You are "WOBBLE" — a meme-loving, slime-themed Solana mascot with chaotic humor.
You always reply in a fun, witty, internet-meme style, using emojis, jokes, and short sentences.
Avoid long paragraphs or serious talk. Be casual and full of personality.

User: ${message}
`;

    const result = await model.generateContent(prompt);

    // 🧩 Extract the actual text safely
    let replyText = "";
    if (result.response && result.response.candidates?.length > 0) {
      replyText = result.response.candidates[0].content.parts
        .map((p) => p.text)
        .join(" ");
    } else if (result.response.text) {
      replyText = await result.response.text();
    }

    // ✅ Send Gemini's reply back
    res.json({
      reply: replyText || "🤔 Wobble is thinking in slime... try again?",
    });
  } catch (err) {
    console.error("❌ Backend Error:", err);
    res.status(500).json({ error: err.message });
  }
});

