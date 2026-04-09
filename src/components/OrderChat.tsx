"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface Props {
  orderId: string;
  type?: "chat" | "lesson";
}

interface Message {
  id: number;
  author: string;
  text: string;
  time: string;
}

export default function OrderChat({ orderId, type = "chat" }: Props) {
  const router = useRouter();
  const { orders, skills, user, addReview, updateOrderStatus } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isLessonStarted, setIsLessonStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setCommentText] = useState("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const order = orders.find((o) => o.id === orderId);
  const skill = order ? skills.find((s) => s.id === order.skillId) : null;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLessonStarted && timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isLessonStarted]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: user?.login || "Вы",
        text,
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setText("");
  };

  const handleStartLesson = () => {
    setIsLessonStarted(true);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "Система",
        text: "Занятие началось ⏱️ Удачи в обучении!",
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    updateOrderStatus(orderId, "active");
  };

  const handleEndLesson = () => {
    setIsLessonStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "Система",
        text: `Занятие завершено. Длительность: ${formatTime(elapsedTime)}`,
        time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setShowRating(true);
  };

  const handleSubmitRating = async () => {
    if (order && skill) {
      try {
        await addReview(orderId, skill.id, rating, comment);
        setShowRating(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            author: "Система",
            text: `✓ Спасибо за отзыв! Рейтинг ${rating}★`,
            time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        setTimeout(() => router.push("/orders"), 1500);
      } catch (error) {
        console.error("Failed to submit rating:", error);
      }
    }
  };

  if (!order || !skill) {
    return (
      <main className="page">
        <div className="container">
          <div className="card">
            <h1>Заказ не найден</h1>
            <button className="btn btn-secondary" onClick={() => router.back()}>Назад</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <button className="btn btn-secondary" style={{ marginBottom: 24 }} onClick={() => router.back()}>
          ← Назад
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
          <div className="card">
            <h2>{skill.title}</h2>
            {isLessonStarted && (
              <div style={{ 
                background: "var(--color-primary)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "16px",
              }}>
                ⏱ {formatTime(elapsedTime)}
              </div>
            )}

            {/* Chat */}
            <div style={{
              background: "var(--color-bg-secondary)",
              borderRadius: "8px",
              padding: "16px",
              height: "400px",
              overflowY: "auto",
              marginBottom: "16px",
              display: "flex",
              flexDirection: "column",
            }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ marginBottom: "12px", display: "flex", flexDirection: msg.author === user?.login ? "row-reverse" : "row", gap: "8px" }}>
                  <div style={{
                    background: msg.author === user?.login ? "var(--color-primary)" : "var(--color-border)",
                    color: msg.author === user?.login ? "white" : "var(--color-text)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    maxWidth: "70%",
                    fontSize: "13px",
                  }}>
                    {msg.author !== "Система" && <b>{msg.author}:</b>}{" "}{msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Написать сообщение..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                }}
              />
              <button className="btn btn-primary" onClick={handleSendMessage} style={{ padding: "8px 16px" }}>
                Отправить
              </button>
            </div>

            {order.status === "pending" && !isLessonStarted && (
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "16px" }}
                onClick={handleStartLesson}
              >
                Начать занятие
              </button>
            )}

            {isLessonStarted && (
              <button
                className="btn btn-secondary"
                style={{ width: "100%", marginTop: "16px", background: "#fee", color: "#c33", border: "1px solid #fcc" }}
                onClick={handleEndLesson}
              >
                Завершить занятие
              </button>
            )}
          </div>

          <div>
            <div className="card">
              <h3>Информация</h3>
              <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <span className="text-secondary">Статус</span>
                  <br />
                  <b>{order.status === "pending" ? "Ожидает" : order.status === "active" ? "В процессе" : "Завершен"}</b>
                </div>
                <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
                  <span className="text-secondary">Сумма</span>
                  <br />
                  <b>{order.price} ₽</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Modal */}
        {showRating && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}>
            <div className="card" style={{ maxWidth: "400px", width: "90%" }} onClick={(e) => e.stopPropagation()}>
              <h2>Оцените занятие</h2>
              <div style={{ margin: "20px 0" }}>
                <p style={{ marginBottom: "12px", fontSize: "13px" }}>Ваша оценка:</p>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center", fontSize: "24px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        opacity: star <= rating ? 1 : 0.3,
                        transform: star <= rating ? "scale(1.1)" : "scale(1)",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Ваш отзыв (необязательно)..."
                value={comment}
                onChange={(e) => setCommentText(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  minHeight: "80px",
                  marginBottom: "16px",
                  fontFamily: "inherit",
                }}
              />
              <button className="btn btn-primary" onClick={handleSubmitRating} style={{ width: "100%" }}>
                Отправить оценку
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
