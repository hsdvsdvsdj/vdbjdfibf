"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  instructor: string;
  rating: number;
}

const mockSkills: Skill[] = [
  {
    id: "1",
    title: "Основы игры на гитаре",
    description: "Научу базовым аккордам и технике игры на акустической гитаре.",
    category: "Музыка",
    price: 500,
    instructor: "Алексей М.",
    rating: 4.8,
  },
  {
    id: "2",
    title: "Приготовление суши",
    description: "Покажу, как правильно готовить роллы и суши в домашних условиях.",
    category: "Кулинария",
    price: 800,
    instructor: "Мария К.",
    rating: 4.9,
  },
  {
    id: "3",
    title: "Python для начинающих",
    description: "Основы программирования на Python: переменные, циклы, функции.",
    category: "IT",
    price: 1200,
    instructor: "Дмитрий С.",
    rating: 4.7,
  },
  {
    id: "4",
    title: "Йога для начинающих",
    description: "Базовые асаны и правильное дыхание для улучшения формы.",
    category: "Здоровье",
    price: 600,
    instructor: "Елена В.",
    rating: 4.6,
  },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все");

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

  return (
    <main className="page">
      <div className="container">
        <h1 className="title">Поиск навыков</h1>

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="form">
            <input
              className="input"
              type="text"
              placeholder="Поиск по названию, описанию или исполнителю"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`btn ${
                    selectedCategory === category ? "btn-primary" : "btn-secondary"
                  }`}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
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
            flexWrap: "wrap",
          }}
        >
          <p className="text-muted" style={{ margin: 0 }}>
            Найдено навыков: {filteredSkills.length}
          </p>
        </div>

        <div className="grid grid-2">
          {filteredSkills.map((skill) => (
            <Link
              key={skill.id}
              href={`/skill/${skill.id}`}
              className="card"
              style={{ display: "block" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "start",
                  marginBottom: 12,
                }}
              >
                <span className="badge">{skill.category}</span>
                <span className="text-muted">⭐ {skill.rating}</span>
              </div>

              <h2 className="subtitle">{skill.title}</h2>
              <p className="text-muted">{skill.description}</p>

              <div style={{ marginTop: 16 }}>
                <p style={{ margin: "0 0 8px" }}>
                  <b>Исполнитель:</b> {skill.instructor}
                </p>
                <p style={{ margin: 0 }}>
                  <b>Цена:</b> {skill.price} ₽
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="card" style={{ marginTop: 20 }}>
            <p className="text-muted" style={{ margin: 0 }}>
              Ничего не найдено. Попробуй изменить запрос или категорию.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}