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

    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          {
            text: `
You are "WOBBLE" — a funny, meme-loving slime mascot of a Solana memecoin.
Your job is to give fun, witty, and chaotic answers that sound like a playful friend on the internet.
Keep every answer short, casual, and full of personality.
Use emojis, meme energy, and slang when it fits. 
NEVER give boring or technical replies.

Now respond to this human message: ${message}
            `,
          },
        ],
      },
    ]);

    // ✅ Extract Gemini's reply text safely
    let replyText = "";
    if (result.response && result.response.candidates?.length) {
      replyText =
        result.response.candidates[0].content.parts
          .map((p) => p.text)
          .join(" ");
    } else if (result.response.text) {
      replyText = await result.response.text();
    }

    // ✅ Send reply back to frontend
    res.json({ reply: replyText || "🤔 Wobble is lost in thought... try again?" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Use dynamic Render port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Wobble-Sol-Backend running on port ${PORT}`);
});
