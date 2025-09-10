import OpenAI from "openai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const DEV_FAKE_AI =
  process.env.DEV_FAKE_AI === "1" || process.env.DEV_FAKE_AI === "true";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const client = OPENAI_API_KEY
  ? new OpenAI({ apiKey: OPENAI_API_KEY, timeout: 30000 })
  : null;

const withRetry = async (fn, { attempts = 3, baseDelayMs = 500 } = {}) => {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const isNetwork =
        err?.code === "ECONNRESET" ||
        err?.cause?.code === "ECONNRESET" ||
        err?.status === undefined;
      if (!isNetwork || i === attempts - 1) break;
      await new Promise((r) => setTimeout(r, baseDelayMs * Math.pow(2, i)));
    }
  }
  throw lastErr;
};

export const transcribeAudio = async (filePath) => {
  if (DEV_FAKE_AI) {
    return `Dev transcription placeholder (${new Date().toLocaleString()})`;
  }
  if (!client) {
    throw new Error("OpenAI API key is not set. Set OPENAI_API_KEY in .env");
  }
  const file = fs.createReadStream(filePath);
  const result = await withRetry(() =>
    client.audio.transcriptions.create({
      file,
      model: "whisper-1",
    })
  );
  return result.text;
};

export const summarizeText = async (text) => {
  if (DEV_FAKE_AI) {
    const trimmed = (text || "").trim();
    if (!trimmed) return "";
    const short = trimmed.slice(0, 240);
    return `Summary (dev): ${short}${trimmed.length > 240 ? "…" : ""}`;
  }
  if (!client) {
    throw new Error("OpenAI API key is not set. Set OPENAI_API_KEY in .env");
  }
  const prompt = `Summarize the following note in 2-3 concise sentences. Focus on key points and decisions. Text:\n\n${text}`;
  const completion = await withRetry(() =>
    client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that writes crisp summaries.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    })
  );
  return completion.choices[0]?.message?.content?.trim() || "";
};
