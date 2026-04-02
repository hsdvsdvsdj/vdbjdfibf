"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { SkeletonText, SkeletonCard } from "./Skeleton";

interface Skill {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
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
    duration: 60,
    instructor: "Дмитрий С.",
    instructorId: "5",
    rating: 4.7,
    category: "IT",
    reviewsCount: 18,
  },
  "4": {
    id: "4",
    title: "Йога для начинающих",
    description:
      "Базовые асаны и правильное дыхание для улучшения формы и самочувствия.",
    fullDescription:
      "Научу основным асанам, правильному дыханию и расслаблению. Занятие подходит для всех уровней подготовки. Вы улучшите гибкость, избавитесь от стресса и почувствуете легкость в теле.",
    duration: 40,
    instructor: "Елена В.",
    instructorId: "6",
    rating: 4.6,
    category: "Здоровье",
    reviewsCount: 15,
  },
  "5": {
    id: "5",
    title: "Рисование акварелью",
    description:
      "Техники работы с акварелью, создание пейзажей и смешивание цветов.",
    fullDescription:
      "Научу основным техникам работы с акварелью, правильному смешиванию цветов, созданию пейзажей и натюрмортов. Вы научитесь видеть свет, тень и глубину в рисунке.",
    duration: 50,
    instructor: "Ольга Н.",
    instructorId: "7",
    rating: 4.8,
    category: "Искусство",
    reviewsCount: 21,
  },
  "6": {
    id: "6",
    title: "Разговорный английский",
    description:
      "Практика разговорного английского языка и повседневных ситуаций.",
    fullDescription:
      "Практикуем разговорный английский в реальных ситуациях: заказ в кафе, знакомство, работа, путешествия. Учимся естественно общаться и преодолевать языковой барьер.",
    duration: 45,
    instructor: "Иван Р.",
    instructorId: "8",
    rating: 4.9,
    category: "Языки",
    reviewsCount: 31,
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
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const skill = mockSkills[skillId];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [skillId]);

  if (!skill) {
    return (
      <main className="page">
        <div className="container">
          <div className="card">
            <h1 className="title">Навык не найден</h1>
            <p className="text-secondary">Похоже, такого навыка не существует.</p>
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
    router.push(`/order/${skill.id}`);
  };

  return (
    <main className="page">
      <div className="container">
        <button
          className="btn btn-secondary"
          style={{ marginBottom: 24 }}
          onClick={() => router.back()}
        >
          Назад
        </button>

        {isLoading ? (
          <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div>
              <div className="card" style={{ marginBottom: 24 }}>
                <SkeletonText width="60px" />
                <div style={{ marginTop: 12 }}>
                  <SkeletonText width="90%" />
                </div>
                <div style={{ marginTop: 16 }}>
                  <SkeletonText lines={3} width="100%" />
                </div>
              </div>
              <SkeletonCard />
            </div>
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", gap: 24 }}>
            <div>
              <div className="card" style={{ marginBottom: 24 }}>
                <span
                  style={{
                    background: "var(--color-bg-secondary)",
                    color: "var(--color-text-secondary)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "500",
                    display: "inline-block",
                  }}
                >
                  {skill.category}
                </span>
                <h1 className="title" style={{ marginTop: 12 }}>
                  {skill.title}
                </h1>

                <div
                  style={{
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <p style={{ margin: "0 0 8px", fontSize: "13px" }}>
                    <b>Исполнитель:</b>{" "}
                    <Link href={`/profile/${skill.instructorId}`} style={{ color: "var(--color-primary)" }}>
                      {skill.instructor}
                    </Link>
                  </p>
                  <p style={{ margin: "0 0 8px", fontSize: "13px" }}>
                    <b>Длительность:</b> {skill.duration} мин
                  </p>
                  <p style={{ margin: 0, fontSize: "13px" }}>
                    <b>Рейтинг:</b> {skill.rating} ({skill.reviewsCount} отзывов)
                  </p>
                </div>

                <h2 className="subtitle">Описание</h2>
                <p className="text-secondary" style={{ lineHeight: "1.6" }}>
                  {skill.fullDescription}
                </p>

                <h2 className="subtitle" style={{ marginTop: 24 }}>
                  Что будет на занятии
                </h2>
                <ul style={{ paddingLeft: 20, margin: 0, color: "var(--color-text-secondary)", fontSize: "13px" }}>
                  <li style={{ marginBottom: 8 }}>Практическое объяснение материала</li>
                  <li style={{ marginBottom: 8 }}>Ответы на вопросы по теме</li>
                  <li>Полезные советы для самостоятельной работы</li>
                </ul>
              </div>

              <div className="card">
                <h2 className="subtitle">Отзывы ({mockReviews.length})</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {mockReviews.map((review) => (
                    <div
                      key={review.id}
                      className="card"
                      style={{
                        background: "var(--color-bg-secondary)",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                          marginBottom: 8,
                        }}
                      >
                        <Link href={`/profile/${review.userId}`} style={{ fontWeight: "600" }}>
                          {review.userName}
                        </Link>
                        <span style={{ color: "var(--color-text-tertiary)", fontSize: "12px" }}>
                          {review.date}
                        </span>
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        <span style={{ fontSize: "14px", fontWeight: "500" }}>
                          {Array.from({ length: review.rating }).map(() => "★").join("")}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-secondary)" }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="card" style={{ position: "sticky", top: 24 }}>
                <h2 className="subtitle" style={{ marginTop: 0 }}>
                  Информация о навыке
                </h2>

                <button
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "12px 16px", fontSize: "14px", fontWeight: "600", marginBottom: "20px" }}
                  onClick={handleOrder}
                >
                  Заказать навык
                </button>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    fontSize: "13px",
                  }}
                >
                  <div>
                    <span className="text-secondary">Исполнитель</span>
                    <br />
                    <Link href={`/profile/${skill.instructorId}`} style={{ color: "var(--color-primary)", fontWeight: "600" }}>
                      {skill.instructor}
                    </Link>
                  </div>
                  <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
                    <span className="text-secondary">Категория</span>
                    <br />
                    <b>{skill.category}</b>
                  </div>
                  <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
                    <span className="text-secondary">Всего отзывов</span>
                    <br />
                    <b>{skill.reviewsCount}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
