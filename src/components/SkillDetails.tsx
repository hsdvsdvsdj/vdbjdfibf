"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface Skill {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  price: number;
  duration: number;
  instructor: string;
  instructorId: string;
  rating: number;
  category: string;
  reviewsCount: number;
}

interface Props {
  skillId: string;
}

const mockSkills: Record<string, Skill> = {
  "1": {
    id: "1",
    title: "Основы игры на гитаре",
    description:
      "Научу базовым аккордам и технике игры на акустической гитаре.",
    fullDescription:
      "На занятии разберем правильную постановку рук, базовые аккорды, простые бои и переходы между аккордами. В конце вы сможете сыграть первую простую песню.",
    price: 500,
    duration: 30,
    instructor: "Алексей М.",
    instructorId: "3",
    rating: 4.8,
    category: "Музыка",
    reviewsCount: 12,
  },
  "2": {
    id: "2",
    title: "Приготовление суши",
    description:
      "Покажу, как правильно готовить роллы и суши в домашних условиях.",
    fullDescription:
      "Научу варить рис для суши, выбирать ингредиенты, крутить роллы и красиво подавать готовое блюдо. Разберем популярные варианты и частые ошибки.",
    price: 800,
    duration: 45,
    instructor: "Мария К.",
    instructorId: "4",
    rating: 4.9,
    category: "Кулинария",
    reviewsCount: 24,
  },
  "3": {
    id: "3",
    title: "Python для начинающих",
    description:
      "Основы программирования на Python: переменные, циклы, функции.",
    fullDescription:
      "Разберем базовый синтаксис Python, условные операторы, циклы, функции и практические примеры. Подходит тем, кто хочет начать изучение программирования с нуля.",
    price: 1200,
    duration: 60,
    instructor: "Дмитрий С.",
    instructorId: "5",
    rating: 4.7,
    category: "IT",
    reviewsCount: 18,
  },
};

const mockReviews = [
  {
    id: "1",
    userId: "10",
    userName: "Иван П.",
    rating: 5,
    comment: "Очень понравился урок, все понятно и по делу.",
    date: "12.03.2026",
  },
  {
    id: "2",
    userId: "11",
    userName: "Ольга С.",
    rating: 5,
    comment: "Хорошее объяснение, рекомендую.",
    date: "09.03.2026",
  },
  {
    id: "3",
    userId: "12",
    userName: "Петр К.",
    rating: 4,
    comment: "Все хорошо, но хотелось бы чуть больше практики.",
    date: "05.03.2026",
  },
];

export default function SkillDetails({ skillId }: Props) {
  const router = useRouter();
  const { user, updateBalance } = useAuth();
  const [showOrderConfirm, setShowOrderConfirm] = useState(false);

  const skill = mockSkills[skillId];

  if (!skill) {
    return (
      <main className="page">
        <div className="container">
          <div className="card">
            <h1 className="title">Навык не найден</h1>
            <button className="btn btn-secondary" onClick={() => router.back()}>
              Назад
            </button>
          </div>
        </div>
      </main>
    );
  }

  const handleOrder = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.balance < skill.price) {
      alert("Недостаточно средств на балансе");
      return;
    }

    updateBalance(-skill.price);
    const orderId = Date.now().toString();
    router.push(`/order/${orderId}/chat`);
  };

  return (
    <main className="page">
      <div className="container">
        <button
          className="btn btn-secondary"
          style={{ marginBottom: 16 }}
          onClick={() => router.back()}
        >
          Назад
        </button>

        <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <span className="badge">{skill.category}</span>
              <h1 className="title" style={{ marginTop: 12 }}>
                {skill.title}
              </h1>

              <div style={{ marginBottom: 16 }}>
                <p style={{ margin: "0 0 6px" }}>
                  <b>Исполнитель:</b>{" "}
                  <Link href={`/profile/${skill.instructorId}`}>
                    {skill.instructor}
                  </Link>
                </p>
                <p style={{ margin: "0 0 6px" }}>
                  <b>Длительность:</b> {skill.duration} мин
                </p>
                <p style={{ margin: 0 }}>
                  <b>Рейтинг:</b> {skill.rating} ({skill.reviewsCount} отзывов)
                </p>
              </div>

              <h2 className="subtitle">Описание</h2>
              <p className="text-muted">{skill.fullDescription}</p>

              <h2 className="subtitle" style={{ marginTop: 24 }}>
                Что будет на занятии
              </h2>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>Практическое объяснение материала</li>
                <li>Ответы на вопросы по теме</li>
                <li>Полезные советы для самостоятельной работы</li>
              </ul>
            </div>

            <div className="card">
              <h2 className="title" style={{ fontSize: 24 }}>
                Отзывы
              </h2>

              <div className="list">
                {mockReviews.map((review) => (
                  <div key={review.id} className="card" style={{ background: "#f9fafb" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        marginBottom: 8,
                      }}
                    >
                      <Link href={`/profile/${review.userId}`}>
                        <b>{review.userName}</b>
                      </Link>
                      <span className="text-muted">{review.date}</span>
                    </div>

                    <p style={{ margin: "0 0 8px" }}>Оценка: {review.rating}/5</p>
                    <p style={{ margin: 0 }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <div style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>
                {skill.price} ₽
              </div>
              <p className="text-muted" style={{ marginBottom: 20 }}>
                за {skill.duration} минут
              </p>

              <button
                className="btn btn-primary"
                style={{ width: "100%" }}
                onClick={() => setShowOrderConfirm(true)}
              >
                Заказать навык
              </button>

              <div style={{ marginTop: 20 }}>
                <p style={{ margin: "0 0 8px" }}>
                  <b>Исполнитель:</b> {skill.instructor}
                </p>
                <p style={{ margin: "0 0 8px" }}>
                  <b>Категория:</b> {skill.category}
                </p>
                <p style={{ margin: 0 }}>
                  <b>Отзывы:</b> {skill.reviewsCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {showOrderConfirm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              zIndex: 1000,
            }}
          >
            <div
              className="card"
              style={{
                maxWidth: 420,
                width: "100%",
              }}
            >
              <h3 className="subtitle">Подтверждение заказа</h3>
              <p>
                <b>Навык:</b> {skill.title}
              </p>
              <p>
                <b>Стоимость:</b> {skill.price} ₽
              </p>
              <p>
                <b>Ваш баланс:</b> {user?.balance || 0} ₽
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 20,
                }}
              >
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowOrderConfirm(false)}
                >
                  Отмена
                </button>

                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setShowOrderConfirm(false);
                    handleOrder();
                  }}
                >
                  Подтвердить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}