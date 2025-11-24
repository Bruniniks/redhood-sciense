"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Send, Beaker, Info, Sparkles } from 'lucide-react';

// --- СТИЛИ ---
const THEME = {
  bg: "bg-zinc-950",
  text: "text-zinc-200",
  bubbleAI: "bg-red-950/40 border-l-2 border-red-700",
  bubbleUser: "bg-zinc-800/50 border-r-2 border-zinc-600",
};

export default function RedhoodChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Система Redhood Science® онлайн. Хозяйка Сэри готова к взаимодействию. Введите запрос, объект наблюдения.",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput(''); // Очистить поле сразу

    // 1. Добавляем сообщение пользователя
    const userMsg = {
      id: Date.now(),
      text: userText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // 2. Отправляем запрос на наш Бэкенд
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      if (!response.ok) throw new Error('Network error');
      
      const data = await response.json();

      // 3. Добавляем ответ ИИ
      const aiMsg = {
        id: Date.now() + 1,
        text: data.reply,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      // Обработка ошибки
      const errorMsg = {
        id: Date.now() + 1,
        text: "Сбой соединения с лабораторией. Попробуйте позже.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`flex flex-col h-screen ${THEME.bg} ${THEME.text} font-sans overflow-hidden`}>
      
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 z-10">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-red-900 rounded-full blur opacity-50 group-hover:opacity-75 transition"></div>
            <div className="relative bg-black rounded-full p-2 border border-zinc-700">
               <Beaker className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-wider text-white font-mono uppercase">
              Redhood <span className="text-red-600">Science</span><span className="text-xs align-top text-zinc-500">®</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              HOST: SERI // ONLINE
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400">
          <Info className="w-5 h-5" />
        </button>
      </header>

      {/* CHAT AREA */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] p-4 rounded-lg shadow-md text-sm sm:text-base leading-relaxed ${msg.sender === 'user' ? THEME.bubbleUser : THEME.bubbleAI}`}>
              <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase font-mono tracking-widest">
                {msg.sender === 'ai' ? (
                  <><Sparkles className="w-3 h-3 text-red-500" /><span className="text-red-400">Хозяйка Сэри</span></>
                ) : (
                  <span className="text-zinc-400">Гость</span>
                )}
              </div>
              <div className={msg.sender === 'ai' ? 'text-zinc-100' : 'text-zinc-300'}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start w-full">
            <div className={`${THEME.bubbleAI} p-4 rounded-lg`}>
              <span className="text-xs font-mono animate-pulse text-red-500">Анализ данных...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* INPUT */}
      <footer className="p-4 bg-zinc-900 border-t border-zinc-800">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-end gap-3 relative">
          <div className="flex-1 relative">
            <div className="absolute -top-2 left-0 text-[10px] text-zinc-600 font-mono bg-zinc-900 px-1">ВВОД</div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спросите о природе реальности..."
              className="w-full bg-zinc-950 border border-zinc-700 text-zinc-200 p-4 focus:border-red-700 focus:outline-none font-mono text-sm rounded-sm"
            />
          </div>
          <button type="submit" disabled={!input.trim() || isTyping} className="p-4 bg-red-900 hover:bg-red-800 text-white disabled:opacity-50 rounded-sm">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}


