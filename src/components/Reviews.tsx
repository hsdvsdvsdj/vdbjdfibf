"use client";

import { useState, useEffect } from "react";
import { SkeletonCard } from "./Skeleton";

const mockSkills = [
  { id: "1", title: "Основы игры на гитаре" },
  { id: "2", title: "Приготовление суши" },
  { id: "3", title: "Python для начинающих" },
];

const mockReviews = [
  {
    id: "1",
    author: "Анна",
    skillId: "1",
    skillTitle: "Основы игры на гитаре",
    text: "Очень понравилась работа, все объяснили быстро и понятно.",
    rating: 5,
    date: "11.03.2026",
  },
  {
    id: "2",
    author: "Сергей",
    skillId: "2",
    skillTitle: "Приготовление суши",
    text: "Хороший исполнитель, рекомендую.",
    rating: 4,
    date: "08.03.2026",
  },
  {
    id: "3",
    author: "Марина",
    skillId: "1",
    skillTitle: "Основы игры на гитаре",
    text: "Все было качественно, осталась довольна.",
    rating: 5,
    date: "03.03.2026",
  },
];

export default function Reviews() {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState(mockReviews);
  const [selectedSkill, setSelectedSkill] = useState(mockSkills[0].id);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!authorName.trim() || !text.trim()) {
      setError("Заполни имя и текст отзыва");
      return;
    }

    const skill = mockSkills.find(s => s.id === selectedSkill);
    if (!skill) return;

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}.${String(today.getMonth() + 1).padStart(2, "0")}.${today.getFullYear()}`;

    const newReview = {
      id: Date.now().toString(),
      author: authorName.trim(),
      skillId: selectedSkill,
      skillTitle: skill.title,
      text: text.trim(),
      rating: rating,
      date: dateStr,
    };

    setReviews((prev) => [newReview, ...prev]);
    setAuthorName("");
    setText("");
    setRating(5);
  };

  const averageRating = (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <main className="page">
      <div className="container">
        <h1 className="title" style={{ marginBottom: "32px" }}>Отзывы</h1>

        {/* Rating Summary */}
        <div className="card" style={{ marginBottom: 24, background: "linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div>
              <div style={{ fontSize: 56, fontWeight: 700, color: "var(--color-primary)" }}>
                {averageRating}
              </div>
              <div style={{ color: "var(--color-text-secondary)", fontSize: "13px", fontWeight: "600" }}>
                из 5.0
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: "0 0 12px", color: "var(--color-text-secondary)", fontSize: "14px" }}>
                Средняя оценка от {reviews.length} отзывов
              </p>
              <div style={{ fontSize: "18px", letterSpacing: "2px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} style={{ color: i < Math.round(parseFloat(averageRating)) ? "#FFD700" : "#DDD" }}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leave a Review Form */}
        <div className="card" style={{ padding: "28px", marginBottom: "32px", background: "linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%)" }}>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            margin: "0 0 24px 0",
            color: "var(--color-text-primary)"
          }}>
            Оставить отзыв
          </h2>

          <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Skill Selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)" }}>
                На какой навык оставить отзыв
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                style={{ padding: "10px 12px", fontSize: "14px" }}
              >
                {mockSkills.map(skill => (
                  <option key={skill.id} value={skill.id}>{skill.title}</option>
                ))}
              </select>
            </div>

            {/* Name Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)" }}>
                Твое имя
              </label>
              <input
                type="text"
                className="input"
                placeholder="Как тебя зовут?"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </div>

            {/* Rating Selection */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)" }}>
                Оценка
              </label>
              <div style={{
                display: "flex",
                gap: "8px",
                padding: "12px 16px",
                background: "rgba(255, 215, 0, 0.08)",
                borderRadius: "8px"
              }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i + 1)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "28px",
                      cursor: "pointer",
                      color: i < rating ? "#FFD700" : "#DDD",
                      transition: "all 0.2s",
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)" }}>
                Твой отзыв
              </label>
              <textarea
                className="input"
                placeholder="Напиши подробный отзыв..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                style={{ resize: "none" }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                background: "#ffebee",
                color: "#c62828",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                borderLeft: "3px solid #c62828"
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "12px 24px", fontSize: "14px" }}
            >
              Опубликовать отзыв
            </button>
          </form>
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {reviews.map((review) => (
              <div key={review.id} className="card" style={{
                padding: "20px 24px",
                borderLeft: "3px solid var(--color-primary)"
              }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontWeight: "600", fontSize: "16px", color: "var(--color-text-primary)" }}>
                      {review.author}
                    </h3>
                    <p style={{ margin: "0 0 4px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                      {review.skillTitle}
                    </p>
                    <span
                      style={{
                        color: "var(--color-text-secondary)",
                        fontSize: "12px",
                      }}
                    >
                      {review.date}
                    </span>
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "600", letterSpacing: "1px" }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{ color: i < review.rating ? "#FFD700" : "#DDD" }}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: "var(--color-text-primary)",
                    lineHeight: "1.6",
                    fontSize: "14px",
                  }}
                >
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}