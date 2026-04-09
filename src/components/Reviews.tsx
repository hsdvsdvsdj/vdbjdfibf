"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { SkeletonCard } from "./Skeleton";

export default function Reviews() {
  const { reviews, skills } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (skills.length > 0 && !selectedSkill) {
      setSelectedSkill(skills[0].id);
    }
  }, [skills]);

  const skillReviews = selectedSkill
    ? reviews.filter((r) => r.skillId === selectedSkill)
    : [];

  const avgRating = skillReviews.length > 0
    ? (skillReviews.reduce((sum, r) => sum + r.rating, 0) / skillReviews.length).toFixed(1)
    : "0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: skillReviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <main className="page">
      <div className="container">
        <h1 className="title" style={{ marginBottom: 24 }}>Отзывы</h1>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
          {/* Боковая панель */}
          <div>
            <div className="card">
              <h3 className="subtitle" style={{ marginTop: 0 }}>Ваши навыки</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkill(skill.id)}
                      style={{
                        padding: "12px",
                        background: selectedSkill === skill.id ? "var(--color-primary)" : "var(--color-bg-secondary)",
                        color: selectedSkill === skill.id ? "white" : "var(--color-text)",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "500",
                        textAlign: "left",
                      }}
                    >
                      {skill.title}
                    </button>
                  ))
                ) : (
                  <p className="text-secondary">Нет навыков</p>
                )}
              </div>
            </div>
          </div>

          {/* Основная область */}
          <div>
            {isLoading ? (
              <div style={{ display: "grid", gap: 16 }}>
                {[1, 2, 3].map((i) => (<SkeletonCard key={i} />))}
              </div>
            ) : (
              <>
                {/* Статистика рейтинга */}
                <div className="card" style={{ marginBottom: 24 }}>
                  <h2>Рейтинг</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 32, alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "48px", fontWeight: "700", color: "var(--color-primary)" }}>
                        {avgRating}
                      </div>
                      <div style={{ fontSize: "16px", color: "var(--color-text-secondary)" }}>
                        ⭐ из 5
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "8px" }}>
                        {skillReviews.length} отзывов
                      </div>
                    </div>

                    <div>
                      {ratingDistribution.map(({ rating, count }) => (
                        <div key={rating} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                          <span style={{ width: "40px", fontSize: "12px" }}>{rating}★</span>
                          <div style={{
                            flex: 1,
                            height: "8px",
                            background: "var(--color-bg-secondary)",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}>
                            <div style={{
                              height: "100%",
                              background: "var(--color-primary)",
                              width: `${skillReviews.length > 0 ? (count / skillReviews.length) * 100 : 0}%`,
                            }} />
                          </div>
                          <span style={{ width: "30px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Список отзывов */}
                <div className="card">
                  <h2>Отзывы учеников</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {skillReviews.length > 0 ? (
                      skillReviews.map((review) => (
                        <div
                          key={review.id}
                          style={{
                            padding: "16px",
                            background: "var(--color-bg-secondary)",
                            borderRadius: "8px",
                            borderLeft: "3px solid var(--color-primary)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                            <strong>{review.fromUserId}</strong>
                            <span style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>
                              {new Date(review.createdAt).toLocaleDateString("ru-RU")}
                            </span>
                          </div>
                          <div style={{ marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                            {"⭐".repeat(review.rating)}
                          </div>
                          <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                            {review.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-secondary">Нет отзывов</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
