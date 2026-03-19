"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateSkill() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (
      !title.trim() ||
      !category.trim() ||
      !price.trim() ||
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
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="card">
          <h1 className="title">Создать навык</h1>

          <form className="form" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Название навыка"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="input"
              type="text"
              placeholder="Категория"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              className="input"
              type="number"
              placeholder="Цена"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              className="input"
              type="number"
              placeholder="Длительность в минутах"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <textarea
              className="input"
              placeholder="Описание навыка"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />

            {error ? <p style={{ color: "crimson", margin: 0 }}>{error}</p> : null}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn btn-primary" type="submit">
                Создать
              </button>

              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => router.push("/home")}
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