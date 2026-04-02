"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  orderId: string;
}

interface ChatItem {
  id: string;
  personName: string;
  skillTitle: string;
}

const chats: ChatItem[] = [
  { id: "1", personName: "Дмитрий", skillTitle: "Python для начинающих" },
  { id: "2", personName: "Мария", skillTitle: "Приготовление суши" },
  { id: "3", personName: "Алексей", skillTitle: "Основы игры на гитаре" },
  { id: "4", personName: "Елена", skillTitle: "Йога для начинающих" },
  { id: "5", personName: "Иван", skillTitle: "Язык JavaScript" },
];

const initialMessages = [
  {
    id: 1,
    author: "Дмитрий",
    text: "Здравствуйте! Хотел бы обсудить детали занятия.",
    time: "12:10",
  },
  {
    id: 2,
    author: "Вы",
    text: "Здравствуйте! Конечно, давайте уточним, что именно вам нужно.",
    time: "12:12",
  },
];

export default function OrderChat({ orderId }: Props) {
  const [selectedChatId, setSelectedChatId] = useState(orderId === "general" ? chats[0].id : orderId);
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const selectedChat = chats.find(c => c.id === selectedChatId);
  const isGeneralChat = orderId === "general";
  const headerTitle = selectedChat ? `${selectedChat.personName} — ${selectedChat.skillTitle}` : "Чат";
  const headerSubtitle = "Обсуждение условий";

  const handleSend = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "24px",
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: "280px 1fr",
        gap: "24px",
      }}
    >
      {/* Chat List */}
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: "700",
            margin: "0 0 16px 0",
            color: "var(--color-text-primary)",
          }}
        >
          Чаты
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", paddingRight: "4px" }}>
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              style={{
                padding: "12px 16px",
                background: selectedChatId === chat.id ? "var(--color-primary)" : "var(--color-bg-secondary)",
                color: selectedChatId === chat.id ? "white" : "var(--color-text-secondary)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: selectedChatId === chat.id ? "600" : "400",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (selectedChatId !== chat.id) {
                  e.currentTarget.style.background = "var(--color-bg-tertiary)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedChatId !== chat.id) {
                  e.currentTarget.style.background = "var(--color-bg-secondary)";
                }
              }}
            >
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>{chat.personName}</div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>{chat.skillTitle}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Chat Header */}
            <div
              className="card"
              style={{
                padding: "16px 24px",
                marginBottom: "16px",
                background: "linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%)",
                borderRadius: "8px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "var(--color-text-primary)",
                }}
              >
                {headerTitle}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {headerSubtitle}
              </p>
            </div>

            {/* Chat Messages */}
            <div
              className="card"
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                flex: 1,
                minHeight: 0,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      background: message.author === "Вы" ? "rgba(59, 130, 246, 0.1)" : "var(--color-bg-secondary)",
                      border: "1px solid var(--color-border)"
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
                      <b style={{ color: "var(--color-text-primary)" }}>{message.author}</b>
                      <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>{message.time}</span>
                    </div>

                    <p style={{ margin: 0, color: "var(--color-text-primary)", lineHeight: "1.5" }}>{message.text}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form style={{ display: "flex", gap: "8px", alignItems: "center" }} onSubmit={handleSend}>
                <textarea
                  className="input"
                  placeholder="Введи сообщение..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  style={{ resize: "none", flex: 1 }}
                />

                <button
                  className="btn btn-primary"
                  type="submit"
                  style={{ padding: "8px 16px", fontSize: "13px", whiteSpace: "nowrap", height: "fit-content" }}
                >
                  Отправить
                </button>
              </form>
            </div>
          </div>
        </div>
  );
}