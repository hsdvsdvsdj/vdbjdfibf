"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { SkeletonGrid } from "./Skeleton";

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
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const handleSkillClick = (skillId: string) => {
    router.push(`/skill/${skillId}`);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="page">
      <div className="container">
        <div className="card" style={{ marginBottom: 32 }}>
          <h1 className="title" style={{ marginBottom: 8, margin: 0 }}>
            Добро пожаловать, {user?.username || "пользователь"}!
          </h1>
          <p className="text-secondary" style={{ marginBottom: 24, fontSize: "14px" }}>
            Найди полезные навыки для изучения или предложи свои услуги другим.
          </p>

          <div className="grid grid-3">
            <Link href="/create-skill">
              <div className="card" style={{ display: "block", textDecoration: "none", cursor: "pointer" }}>
                <h3 className="subtitle">Создать навык</h3>
                <p className="text-secondary" style={{ fontSize: "13px", margin: 0 }}>
                  Добавь свой навык и начни получать заказы.
                </p>
              </div>
            </Link>

            <Link href="/orders">
              <div className="card" style={{ display: "block", textDecoration: "none", cursor: "pointer" }}>
                <h3 className="subtitle">Мои заказы</h3>
                <p className="text-secondary" style={{ fontSize: "13px", margin: 0 }}>
                  Просматривай активные и завершенные заказы.
                </p>
              </div>
            </Link>

            <Link href="/reviews">
              <div className="card" style={{ display: "block", textDecoration: "none", cursor: "pointer" }}>
                <h3 className="subtitle">Отзывы</h3>
                <p className="text-secondary" style={{ fontSize: "13px", margin: 0 }}>
                  Следи за оценками и мнением пользователей.
                </p>
              </div>
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
            marginBottom: 24,
          }}
        >
          <h2 className="title" style={{ margin: 0 }}>
            Популярные навыки
          </h2>

          <Link href="/search" className="btn btn-primary">
            Смотреть все
          </Link>
        </div>

        {isLoading ? (
          <SkeletonGrid columns={3} count={6} />
        ) : (
          <div className="grid grid-3">
            {mockSkills.map((skill) => (
              <div
                key={skill.id}
                className="card"
                style={{ display: "block", height: "100%", cursor: "pointer" }}
                onClick={() => handleSkillClick(skill.id)}
              >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
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
                    <span style={{ fontSize: "14px", fontWeight: "500" }}>
                      ⭐ {skill.rating}
                    </span>
                  </div>

                  <h3 className="subtitle">{skill.title}</h3>
                  <p className="text-secondary" style={{ fontSize: "13px", margin: "8px 0" }}>
                    {skill.description}
                  </p>

                  <div
                    style={{
                      borderTop: "1px solid var(--color-border)",
                      paddingTop: "12px",
                      marginTop: "12px",
                      fontSize: "13px",
                    }}
                  >
                    <p style={{ margin: "0 0 6px", color: "var(--color-text-secondary)" }}>
                      {skill.instructor}
                    </p>
                    <p style={{ margin: "0 0 6px", color: "var(--color-text-secondary)" }}>
                      {skill.duration} мин
                    </p>
                    <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                      {skill.reviewsCount} отзывов
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                      borderTop: "1px solid var(--color-border)",
                      paddingTop: "12px",
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "500", color: "var(--color-primary)" }}>
                      Подробнее →
                    </span>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}