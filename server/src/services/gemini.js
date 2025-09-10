import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

// ------------------------ Config ------------------------
const DEV_FAKE_AI =
  process.env.DEV_FAKE_AI === "1" || process.env.DEV_FAKE_AI === "true";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// ------------------------ Retry Utility ------------------------
const withRetry = async (fn, { attempts = 3, baseDelayMs = 500 } = {}) => {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const isNetwork = err?.code === "ECONNRESET" || err?.status === undefined;
      if (!isNetwork || i === attempts - 1) break;
      await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, i)));
    }
  }
  throw lastErr;
};

// ------------------------ Audio Transcription ------------------------
export const transcribeAudio = async (filePath) => {
  if (DEV_FAKE_AI) {
    return `Dev transcription placeholder (${new Date().toLocaleString()})`;
  }

  if (!genAI) {
    throw new Error("Gemini API key is not set. Set GEMINI_API_KEY in .env");
  }

  const fileBuffer = fs.readFileSync(filePath);
  const base64 = fileBuffer.toString("base64");

  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  const prompt =
    "You are a precise transcriber. Transcribe the following audio as clean text. Return only the transcript without extra commentary.";

  const result = await withRetry(async () => {
    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "audio/webm", 
                data: base64,
              },
            },
          ],
        },
      ],
    });
    return response;
  });

  const text = result?.response?.text?.() || "";
  return (typeof text === "function" ? text() : text).trim();
};

// ------------------------ Text Summarization ------------------------
export const summarizeText = async (text) => {
  if (DEV_FAKE_AI) {
    const trimmed = (text || "").trim();
    if (!trimmed) return "";
    const short = trimmed.slice(0, 240);
    return `Summary (dev): ${short}${trimmed.length > 240 ? "…" : ""}`;
  }

  if (!genAI) {
    throw new Error("Gemini API key is not set. Set GEMINI_API_KEY in .env");
  }

  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });
  const prompt = `Summarize the following note in 2-3 concise sentences. Focus on key points and decisions. Text:\n\n${text}`;

  const result = await withRetry(async () => {
    const response = await model.generateContent(prompt);
    return response;
  });

  const out = result?.response?.text?.() || "";
  return (typeof out === "function" ? out() : out).trim();
};
