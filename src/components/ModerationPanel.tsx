"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function ModerationPanel() {
  const { skills, user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Получаем только навыки текущего пользователя (преподавателя)
  const userSkills = skills.filter((s) => s.authorId === user?.id || s.authorId === user?.login);

  const filteredSkills = useMemo(() => {
    return userSkills.filter((skill) => {
      const categoryMatch = categoryFilter === "all" || skill.category === categoryFilter;
      return categoryMatch;
    });
  }, [userSkills, categoryFilter]);

  const categories = ["all", ...new Set(userSkills.map((s) => s.category))];

  const stats = {
    total: userSkills.length,
    published: userSkills.length,
    reviews: userSkills.reduce((sum, s) => sum + (s.reviews?.length || 0), 0),
    avgRating: userSkills.length > 0
      ? (userSkills.reduce((sum, s) => sum + s.rating, 0) / userSkills.length).toFixed(1)
      : "0",
  };

  return (
    <main className="page">
      <div className="container">
        <h1 className="title" style={{ marginBottom: 24 }}>Мои навыки</h1>

        {/* Статистика */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          <div className="card">
            <p className="text-secondary">Всего навыков</p>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>{stats.total}</div>
          </div>
          <div className="card">
            <p className="text-secondary">Опубликовано</p>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>{stats.published}</div>
          </div>
          <div className="card">
            <p className="text-secondary">Всего отзывов</p>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>{stats.reviews}</div>
          </div>
          <div className="card">
            <p className="text-secondary">Средний рейтинг</p>
            <div style={{ fontSize: "32px", fontWeight: "700" }}>
              {stats.avgRating}⭐
            </div>
          </div>
        </div>

        {/* Фильтры и добавление */}
        <div className="card" style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 16, flexGrow: 1 }}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg)",
                color: "var(--color-text)",
              }}
            >
              <option value="all">Все категории</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat === "all" ? "Все" : cat}</option>
              ))}
            </select>
          </div>
          <Link href="/create-skill" className="btn btn-primary">
            + Создать навык
          </Link>
        </div>

        {/* Список навыков */}
        {filteredSkills.length > 0 ? (
          <div style={{ display: "grid", gap: 16 }}>
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="card"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 200px",
                  gap: 24,
                  alignItems: "start",
                }}
              >
                <div>
                  <Link href={`/skill/${skill.id}`}>
                    <h3 style={{ margin: "0 0 8px", cursor: "pointer", color: "var(--color-primary)" }}>
                      {skill.title}
                    </h3>
                  </Link>
                  <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--color-text-secondary)", minHeight: "40px" }}>
                    {skill.description}
                  </p>
                  <div style={{ display: "flex", gap: 16, fontSize: "12px", color: "var(--color-text-secondary)" }}>
                    <span>📁 {skill.category}</span>
                    <span>💰 {skill.price} ₽</span>
                    <span>⏱ {skill.duration} мин</span>
                    <span>⭐ {skill.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button className="btn btn-primary" style={{ fontSize: "12px" }}>
                    ✏️ Изменить
                  </button>
                  <button className="btn btn-secondary" style={{ fontSize: "12px" }}>
                    👁 Просмотр
                  </button>
                  <button className="btn btn-secondary" style={{ fontSize: "12px", color: "#c33", borderColor: "#fcc" }}>
                    🗑 Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <p className="text-secondary" style={{ marginBottom: "16px" }}>У вас еще нет навыков</p>
            <Link href="/create-skill" className="btn btn-primary">
              Создать первый навык
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
