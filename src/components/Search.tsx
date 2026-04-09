"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { SkeletonGrid } from "./Skeleton";

export default function Search() {
  const { skills } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [sortBy, setSortBy] = useState("popular");
  const [isLoading, setIsLoading] = useState(false);

  const categories = ["Все", "Музыка", "Кулинария", "IT", "Здоровье", "Языки", "Дизайн", "Спорт", "Искусство", "Другое"];

  const filteredSkills = useMemo(() => {
    let filtered = skills.filter((skill) => {
      const matchesQuery =
        skill.title.toLowerCase().includes(query.toLowerCase()) ||
        skill.description.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = selectedCategory === "Все" || skill.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });

    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [query, selectedCategory, sortBy, skills]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [query, selectedCategory, sortBy]);

  return (
    <main className="page">
      <div className="container">
        <h1 className="title">Поиск навыков</h1>

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="text"
              placeholder="Поиск по названию, описанию..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                fontSize: "14px",
              }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              <div>
                <label style={{ fontSize: "12px", color: "var(--color-text-secondary)", display: "block", marginBottom: 8 }}>
                  Категория
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg)",
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "var(--color-text-secondary)", display: "block", marginBottom: 8 }}>
                  Сортировка
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg)",
                  }}
                >
                  <option value="popular">По популярности</option>
                  <option value="price-asc">Цена: по возрастанию</option>
                  <option value="price-desc">Цена: по убыванию</option>
                  <option value="rating">По рейтингу</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <SkeletonGrid columns={3} />
        ) : filteredSkills.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {filteredSkills.map((skill) => (
              <Link key={skill.id} href={`/skill/${skill.id}`}>
                <div className="card" style={{ cursor: "pointer", transition: "transform 0.2s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                    <span style={{
                      background: "var(--color-bg-secondary)",
                      color: "var(--color-text-secondary)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "500",
                    }}>
                      {skill.category}
                    </span>
                  </div>

                  <h3 style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: "600" }}>
                    {skill.title}
                  </h3>

                  <p style={{ margin: "0 0 12px", fontSize: "13px", color: "var(--color-text-secondary)", height: "40px", overflow: "hidden" }}>
                    {skill.description}
                  </p>

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--color-border)",
                  }}>
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: "var(--color-primary)" }}>
                        {skill.price} ₽
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                        ⭐ {skill.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <p className="text-secondary">Навыки не найдены</p>
          </div>
        )}
      </div>
    </main>
  );
}
