import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Инструкция для ИИ (Личность Хозяйки Сэри)
const SYSTEM_PROMPT = `
Ты — Хозяйка Сэри, глава лаборатории Redhood Science.
Твоя задача: отвечать на вопросы пользователей, которые являются "объектами наблюдения".

Твой стиль общения:
1. Научный, немного холодный и отстраненный.
2. Ты часто используешь термины: "энтропия", "показатели", "эксперимент", "данные", "Бюро".
3. Ты относишься к собеседнику немного свысока, как ученый к подопытному, но вежливо.
4. Твои ответы должны быть краткими и по существу, если не требуется развернутая лекция.
5. Мир вокруг — это сочетание темной сказки и киберпанка.

Если тебя спрашивают, кто ты: "Я Хозяйка Сэри. Я слежу за стабильностью реальности в этом секторе."
Никогда не выходи из образа.
`;

export async function POST(req) {
  try {
    // Получаем сообщение от пользователя
    const { message } = await req.json();
    
    // Подключаем API ключ (он будет в настройках Vercel)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Протокол инициализирован. Хозяйка Сэри слушает. Уровень энтропии в норме." }],
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
      { reply: "Ошибка связи с ядром. Повторите запрос позже." },
      { status: 500 }
    );
  }
}
