"use client";

import React, { useState } from "react";

interface RatingModalProps {
  skillTitle?: string;
  instructor?: string;
  isOpen?: boolean;
  onSubmit?: (rating: number, comment: string) => void;
  onCancel?: () => void;
}

export default function RatingModal({
  skillTitle = "Python для начинающих",
  instructor = "Дмитрий С.",
  isOpen = true,
  onSubmit,
  onCancel,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Выбери оценку");
      return;
    }

    if (!comment.trim()) {
      setError("Напиши свой отзыв");
      return;
    }

    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsLoading(false);
    onSubmit?.(rating, comment);
    
    // Reset
    setRating(0);
    setComment("");
  };

  if (!isOpen) return null;

  return (
    <div className="container" style={{ maxWidth: 500 }}>
      <div className="card">
        <h2 style={{ marginTop: 0, marginBottom: 8 }}>Оценить навык</h2>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: 24 }}>
          {skillTitle} — {instructor}
        </p>

        {/* Звёзды */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: 600, fontSize: "14px", display: "block", marginBottom: 12 }}>
            Твоя оценка
          </label>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 48,
                  padding: 4,
                  transition: "transform 0.2s ease",
                  transform:
                    (hoverRating || rating) >= star ? "scale(1.2)" : "scale(1)",
                  opacity: (hoverRating || rating) >= star ? 1 : 0.3,
                }}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: "var(--color-text-secondary)",
                marginTop: 12,
              }}
            >
              Твоя оценка: <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>{rating}/5</span>
            </p>
          )}
        </div>

        {/* Комментарий */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600, fontSize: "14px", display: "block", marginBottom: 8 }}>
            Твой отзыв
          </label>
          <textarea
            placeholder="Поделись своим мнением о занятии..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
              fontFamily: "inherit",
              fontSize: "13px",
              resize: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Ошибка */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: 16,
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {/* Кнопки */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              flex: 1,
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Отмена
          </button>
          <button
            className="btn"
            onClick={handleSubmit}
            disabled={isLoading || rating === 0}
            style={{
              flex: 1,
              background: rating > 0 ? "var(--color-primary)" : "var(--color-border)",
              color: "white",
              border: "none",
              opacity: isLoading || rating === 0 ? 0.6 : 1,
              cursor: isLoading || rating === 0 ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Сохранение..." : "Отправить оценку"}
          </button>
        </div>
      </div>
    </div>
  );
}
