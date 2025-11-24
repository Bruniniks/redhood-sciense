import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Заставляем Vercel не кэшировать этот файл, чтобы он работал всегда
export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `
Ты — Хозяйка Сэри, глава лаборатории Redhood Science.
Стиль: Научный, холодный, киберпанк.
Отвечай кратко, если не просят подробностей.
Используй термины: "энтропия", "данные", "протокол".
`;

export async function POST(req) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "ОШИБКА: Нет API ключа в настройках Vercel." }, { status: 500 });
    }

    const { message } = await req.json();

    // Используем новую, быструю модель Flash
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error("Critical Error:", error);
    // Этот код выведет ошибку прямо тебе в чат
    return NextResponse.json(
      { reply: `СБОЙ СИСТЕМЫ. Лаборатория сообщает: ${error.message}` },
      { status: 500 }
    );
  }
}
