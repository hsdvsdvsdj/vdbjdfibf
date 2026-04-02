"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateSkill() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !title.trim() ||
      !category.trim() ||
      !duration.trim() ||
      !description.trim()
    ) {
      setError("Заполни все поля");
      return;
    }

    alert("Навык успешно создан");
    router.push("/home");
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
              <input
                className="input"
                type="text"
                placeholder="Например: Дизайн, Программирование, Языки"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {/* Длительность */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: "600", fontSize: "14px", color: "var(--color-text-primary)" }}>
                Длительность (минут)
              </label>
              <input
                className="input"
                type="number"
                placeholder="60"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

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
                style={{ padding: "12px 24px", fontSize: "14px", flex: 1, minWidth: "140px" }}
              >
                Создать навык
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => router.push("/home")}
                style={{
                  padding: "12px 24px",
                  fontSize: "14px",
                  background: "var(--color-bg-secondary)",
                  color: "var(--color-text-secondary)",
                  border: "1px solid var(--color-border)",
                  cursor: "pointer",
                  flex: 1,
                  minWidth: "140px"
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