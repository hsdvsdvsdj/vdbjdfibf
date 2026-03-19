"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

interface Skill {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  instructor: string;
  instructorId: string;
  rating: number;
  category: string;
  reviewsCount: number;
}

const mockSkills: Skill[] = [
  {
    id: "1",
    title: "Основы игры на гитаре",
    description:
      "Научу базовым аккордам и технике игры на акустической гитаре.",
    price: 500,
    duration: 30,
    instructor: "Алексей М.",
    instructorId: "3",
    rating: 4.8,
    category: "Музыка",
    reviewsCount: 12,
  },
  {
    id: "2",
    title: "Приготовление суши",
    description:
      "Покажу, как правильно готовить роллы и суши в домашних условиях.",
    price: 800,
    duration: 45,
    instructor: "Мария К.",
    instructorId: "4",
    rating: 4.9,
    category: "Кулинария",
    reviewsCount: 24,
  },
  {
    id: "3",
    title: "Python для начинающих",
    description:
      "Основы программирования на Python: переменные, циклы, функции.",
    price: 1200,
    duration: 60,
    instructor: "Дмитрий С.",
    instructorId: "5",
    rating: 4.7,
    category: "IT",
    reviewsCount: 18,
  },
  {
    id: "4",
    title: "Йога для начинающих",
    description:
      "Базовые асаны и правильное дыхание для улучшения формы и самочувствия.",
    price: 600,
    duration: 40,
    instructor: "Елена В.",
    instructorId: "6",
    rating: 4.6,
    category: "Здоровье",
    reviewsCount: 15,
  },
  {
    id: "5",
    title: "Рисование акварелью",
    description:
      "Техники работы с акварелью, создание пейзажей и смешивание цветов.",
    price: 700,
    duration: 50,
    instructor: "Ольга Н.",
    instructorId: "7",
    rating: 4.8,
    category: "Искусство",
    reviewsCount: 21,
  },
  {
    id: "6",
    title: "Разговорный английский",
    description:
      "Практика разговорного английского языка и повседневных ситуаций.",
    price: 900,
    duration: 45,
    instructor: "Иван Р.",
    instructorId: "8",
    rating: 4.9,
    category: "Языки",
    reviewsCount: 31,
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="page">
      <div className="container">
        <div className="card" style={{ marginBottom: 24 }}>
          <h1 className="title" style={{ marginBottom: 8 }}>
            Добро пожаловать, {user?.username || "пользователь"}!
          </h1>
          <p className="text-muted" style={{ marginBottom: 20 }}>
            Найди полезные навыки для изучения или предложи свои услуги другим.
          </p>

          <div className="grid grid-3">
            <Link href="/create-skill" className="card">
              <h3 className="subtitle">Создать навык</h3>
              <p className="text-muted">Добавь свой навык и начни получать заказы.</p>
            </Link>

            <Link href="/orders" className="card">
              <h3 className="subtitle">Мои заказы</h3>
              <p className="text-muted">Просматривай активные и завершенные заказы.</p>
            </Link>

            <Link href="/reviews" className="card">
              <h3 className="subtitle">Отзывы</h3>
              <p className="text-muted">Следи за оценками и мнением пользователей.</p>
            </Link>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <h2 className="title" style={{ margin: 0 }}>
            Популярные навыки
          </h2>

          <Link href="/search" className="btn btn-secondary">
            Смотреть все
          </Link>
        </div>

        <div className="grid grid-3">
          {mockSkills.map((skill) => (
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
                  alignItems: "start",
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <span className="badge">{skill.category}</span>
                <span className="text-muted">⭐ {skill.rating}</span>
              </div>

              <h3 className="subtitle">{skill.title}</h3>
              <p className="text-muted">{skill.description}</p>

              <div style={{ marginTop: 16 }}>
                <p style={{ margin: "0 0 6px" }}>
                  <b>Исполнитель:</b> {skill.instructor}
                </p>
                <p style={{ margin: "0 0 6px" }}>
                  <b>Длительность:</b> {skill.duration} мин
                </p>
                <p style={{ margin: 0 }}>
                  <b>Отзывы:</b> {skill.reviewsCount}
                </p>
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 22, fontWeight: 700 }}>
                  {skill.price} ₽
                </span>
                <span className="btn btn-primary">Подробнее</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}