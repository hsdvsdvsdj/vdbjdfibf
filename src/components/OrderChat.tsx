"use client";

import { useState } from "react";

interface Props {
  orderId: string;
}

const initialMessages = [
  {
    id: 1,
    author: "Заказчик",
    text: "Здравствуйте! Хотел бы обсудить детали занятия.",
    time: "12:10",
  },
  {
    id: 2,
    author: "Исполнитель",
    text: "Здравствуйте! Конечно, давайте уточним, что именно вам нужно.",
    time: "12:12",
  },
];

export default function OrderChat({ orderId }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");

  const handleSend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "Вы",
        text: text.trim(),
        time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setText("");
  };

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="card">
          <h1 className="title">Чат по заказу #{orderId}</h1>

          <div
            style={{
              display: "grid",
              gap: 12,
              marginBottom: 20,
              maxHeight: 420,
              overflowY: "auto",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className="card"
                style={{
                  background: message.author === "Вы" ? "#eef4ff" : "#f9fafb",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <b>{message.author}</b>
                  <span className="text-muted">{message.time}</span>
                </div>

                <p style={{ margin: 0 }}>{message.text}</p>
              </div>
            ))}
          </div>

          <form className="form" onSubmit={handleSend}>
            <textarea
              className="input"
              placeholder="Введите сообщение..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />

            <button className="btn btn-primary" type="submit">
              Отправить
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}