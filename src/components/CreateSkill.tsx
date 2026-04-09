"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = [
  "Дизайн",
  "Программирование",
  "Языки",
  "Музыка",
  "Кулинария",
  "IT",
  "Здоровье",
  "Искусство",
  "Спорт",
  "Бизнес",
  "Другое"
];

export default function CreateSkill() {
  const router = useRouter();
  const { createSkill: createSkillInContext } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [learnings, setLearnings] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !title.trim() ||
      !category.trim() ||
      !duration.trim() ||
      !price.trim() ||
      !description.trim()
    ) {
      setError("Заполни все поля");
      return;
    }

    const durationNum = parseInt(duration, 10);
    const priceNum = parseInt(price, 10);

    if (isNaN(durationNum) || durationNum < 1 || durationNum > 180) {
      setError("Длительность должна быть от 1 до 180 минут");
      return;
    }

    if (isNaN(priceNum) || priceNum < 100 || priceNum > 50000) {
      setError("Цена должна быть от 100 до 50000 ₽");
      return;
    }

    try {
      setIsLoading(true);

      const learningsList = learnings
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const skillId = await createSkillInContext({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        duration: durationNum,
        price: priceNum,
        learnings: learningsList.length > 0 ? learningsList : ["Основные навыки"],
      });

      setIsLoading(false);
      router.push(`/skill/${skillId}`);
    } catch (err) {
      setError("Ошибка при создании навыка: " + (err instanceof Error ? err.message : ""));
      setIsLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="card" style={{
          padding: "40px",
          background: "linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%)"
        }}>
          <h1 className="title" style={{ marginBottom: "8px" }}>Создать новый навык</h1>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
            Поделись своими знаниями с другими пользователями
          </p>

          <style>{`
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
            input[type="number"] {
              -moz-appearance: textfield;
            }
          `}</style>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Название */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)" }}>
                Название навыка
              </label>
              <input
                className="input"
                type="text"
                placeholder="Например: Обучение веб-дизайну"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Категория */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)" }}>
                Категория
              </label>
              <select
                className="input"
                style={{
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: "14px"
                }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">-- Выбери категорию --</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Длительность */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)" }}>
                Длительность (минут, макс. 180)
              </label>
              <input
                className="input"
                type="number"
                placeholder="60"
                min="1"
                max="180"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            {/* Цена */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)" }}>
                Цена (₽)
              </label>
              <input
                className="input"
                type="number"
                placeholder="500"
                min="100"
                max="50000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* 
            {/* Описание */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)" }}>
                Описание навыка
              </label>
              <textarea
                className="input"
                placeholder="Опиши подробно что ты можешь преподать..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                style={{
                  resize: "none",
                  fontFamily: "inherit"
                }}
              />
            </div>

            {/* Чему научится ученик */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)" }}>
                Чему научится ученик (по одному пункту на строку)
              </label>
              <textarea
                className="input"
                placeholder={`Базовые аккорды\nТехника игры\nПопулярные песни`}
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                rows={3}
                style={{
                  resize: "none",
                  fontFamily: "inherit"
                }}
              />
            </div>

            {/* Ошибка */}
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

            {/* Кнопки */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isLoading}
                style={{ padding: "12px 24px", fontSize: "14px", flex: 1, minWidth: "140px", opacity: isLoading ? 0.6 : 1 }}
              >
                {isLoading ? "Создание..." : "Создать навык"}
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => router.push("/home")}
                disabled={isLoading}
                style={{
                  padding: "12px 24px",
                  fontSize: "14px",
                  background: "var(--color-bg-secondary)",
                  color: "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                  flex: 1,
                  minWidth: "140px",
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}