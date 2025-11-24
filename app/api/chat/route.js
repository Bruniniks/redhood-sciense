import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// ЭТА СТРОКА ВАЖНА: Она говорит Vercel не пытаться запускать файл при сборке
export const dynamic = 'force-dynamic';

const SYSTEM_PROMPT = `
Ты — Хозяйка Сэри, глава лаборатории Redhood Science.
Твоя задача: отвечать на вопросы пользователей, которые являются "объектами наблюдения".

Твой стиль общения:
1. Научный, немного холодный и отстраненный.
2. Ты часто используешь термины: "энтропия", "показатели", "эксперимент", "данные", "Бюро".
3. Ты относишься к собеседнику немного свысока, но вежливо.
4. Ответы краткие и по существу.
5. Если спрашивают кто ты: "Я Хозяйка Сэри. Я слежу за стабильностью реальности."
`;

export async function POST(req) {
  try {
    // Проверка на наличие ключа
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "Ошибка: Ключ API не найден в системе." }, { status: 500 });
    }

    const { message } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Протокол инициализирован. Хозяйка Сэри на связи." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
    
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { reply: "Сбой связи с лабораторией. Попробуйте позже." },
      { status: 500 }
    );
  }
}
