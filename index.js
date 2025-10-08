import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://cryptoincognito555.github.io", // ✅ your GitHub Pages site
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


    const result = await model.generateContent(message);

    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Wobble-Sol-Backend running on port ${PORT}`);
});
