import google.generativeai as genai
import os
import getpass

# --- 1. НАСТРОЙКА ---
if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = getpass.getpass("Введите API Key: ")

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# Создаем модель и запускаем ЧАТ (History)
model = genai.GenerativeModel('gemini-2.0-flash')
chat = model.start_chat(history=[])

print("\n" + "="*40)
print("✅ РЕЖИМ ДИАЛОГА АКТИВИРОВАН")
print("ИИ помнит контекст беседы. Для выхода введите 'exit'.")
print("="*40 + "\n")

# --- 2. БЕСКОНЕЧНЫЙ ЦИКЛ ОБЩЕНИЯ ---
while True:
    # Ждем ввода от вас прямо в консоли
    user_input = input("ВЫ (Михаил): ")
    
    if user_input.lower() in ['exit', 'quit', 'выход']:
        print("Сеанс завершен.")
        break
    
    if not user_input.strip():
        continue

    try:
        # Отправляем сообщение в чат
        response = chat.send_message(user_input)
        print(f"\n🤖 ИИ: {response.text}")
        print("-" * 20)
    except Exception as e:
        print(f"❌ Ошибка: {e}")
