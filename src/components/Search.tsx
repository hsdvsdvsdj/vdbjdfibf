"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { SkeletonGrid } from "./Skeleton";

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  rating: number;
}

const mockSkills: Skill[] = [
  {
    id: "1",
    title: "Основы игры на гитаре",
    description: "Научу базовым аккордам и технике игры на акустической гитаре.",
    category: "Музыка",
    instructor: "Алексей М.",
    rating: 4.8,
  },
  {
    id: "2",
    title: "Приготовление суши",
    description: "Покажу, как правильно готовить роллы и суши в домашних условиях.",
    category: "Кулинария",
    instructor: "Мария К.",
    rating: 4.9,
  },
  {
    id: "3",
    title: "Python для начинающих",
    description: "Основы программирования на Python: переменные, циклы, функции.",
    category: "IT",
    instructor: "Дмитрий С.",
    rating: 4.7,
  },
  {
    id: "4",
    title: "Йога для начинающих",
    description: "Базовые асаны и правильное дыхание для улучшения формы.",
    category: "Здоровье",
    instructor: "Елена В.",
    rating: 4.6,
  },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [isLoading, setIsLoading] = useState(false);

  const categories = ["Все", "Музыка", "Кулинария", "IT", "Здоровье"];

  const filteredSkills = useMemo(() => {
    return mockSkills.filter((skill) => {
      const matchesQuery =
        skill.title.toLowerCase().includes(query.toLowerCase()) ||
        skill.description.toLowerCase().includes(query.toLowerCase()) ||
        skill.instructor.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        selectedCategory === "Все" || skill.category === selectedCategory;

      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  return (
    <main className="page">
      <div className="container">
        <h1 className="title">Поиск навыков</h1>

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input
              type="text"
              placeholder="Поиск по названию, описанию или исполнителю…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                padding: "12px 16px",
                fontSize: "14px",
                borderRadius: "6px",
                border: "2px solid var(--color-primary)",
                background: "var(--color-bg-secondary)",
                color: "var(--color-text-primary)",
              }}
            />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map((category) => (
                <button
                  key={category}
                  className={selectedCategory === category ? "btn btn-primary" : "btn btn-secondary"}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  style={{ fontSize: "13px" }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <p className="text-secondary" style={{ margin: 0, fontSize: "14px" }}>
            Найдено навыков: <b>{filteredSkills.length}</b>
          </p>
        </div>

        {isLoading ? (
          <SkeletonGrid columns={2} count={4} />
        ) : filteredSkills.length > 0 ? (
          <div className="grid grid-2">
            {filteredSkills.map((skill) => (
              <Link
                key={skill.id}
                href={`/skill/${skill.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="card" style={{ display: "block", height: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        background: "var(--color-bg-secondary)",
                        color: "var(--color-text-secondary)",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: "500",
                      }}
                    >
                      {skill.category}
                    </span>
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>⭐ {skill.rating}</span>
                  </div>

                  <h2 className="subtitle">{skill.title}</h2>
                  <p className="text-secondary" style={{ fontSize: "13px", margin: "8px 0" }}>
                    {skill.description}
                  </p>

                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: "1px solid var(--color-border)",
                    }}
                  >
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-secondary)" }}>
                      {skill.instructor}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card" style={{ marginTop: 20, textAlign: "center" }}>
            <p className="text-secondary" style={{ margin: 0 }}>
              😔 Ничего не найдено. Попробуй изменить запрос или категорию.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}