import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  const url = "https://generativelanguage.googleapis.com/v1/models";
  const apiKey = process.env.GEMINI_API_KEY;

  try {
    const res = await fetch(`${url}?key=${apiKey}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }
    const data = await res.json();
    console.log("✅ Available models:");
    data.models.forEach(m => console.log(m.name));
  } catch (err) {
    console.error("❌ Error listing models:", err.message);
  }
}

listModels();
