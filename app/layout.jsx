import React from 'react';

export const metadata = {
  title: 'Redhood Science Chat',
  description: 'Secure AI Interface',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        {/* Этот скрипт подключит дизайн (цвета и шрифты) без лишних настроек */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body style={{ backgroundColor: '#09090b', color: '#e4e4e7', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
