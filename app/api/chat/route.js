// Импортируем библиотеку Google (JS версия) и инструменты Next.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Эта функция обрабатывает POST-запросы с вашего сайта
export async function POST(req) {
  try {
    // 1. Получаем сообщение от пользователя
    const body = await req.json();
    const { messages } = body;
    
    // Берем последнее сообщение пользователя
    const lastMessage = messages[messages.length - 1].content;

    // 2. Подключаемся к Gemini
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Ключ API не найден" }, { status: 500 });
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    // Используем модель, которая точно работает (проверено нами)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 3. Генерируем ответ
    const result = await model.generateContent(lastMessage);
    const response = await result.response;
    const text = response.text();

    // 4. Отправляем ответ обратно на сайт
    return NextResponse.json({ 
        role: 'assistant', 
        content: text 
    });

  } catch (error) {
    console.error("Сбой в Бюро:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
