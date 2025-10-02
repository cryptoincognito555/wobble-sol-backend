import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Allow frontend requests

// Load Gemini API Key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.0-flash-lite",
    });

    // Pass system-style instruction + user input
    const result = await model.generateContent([
      { text: "You are Wobble, a friendly, witty chatbot who keeps answers short, fun, and positive." },
      { text: message }
    ]);

    // Extract text safely
    const reply = result.response.candidates[0]?.content?.parts[0]?.text || "Oops, I got tongue-tied! 🫠";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Chat error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Wobble-Sol-Backend running on port ${PORT}`);

});


