"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { SkeletonText, SkeletonCard } from "./Skeleton";

interface Props {
  skillId: string;
}

export default function SkillDetails({ skillId }: Props) {
  const router = useRouter();
  const { user, skills, reviews, createOrder } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [error, setError] = useState("");

  const skill = skills.find((s) => s.id === skillId);
  const skillReviews = reviews.filter((r) => r.skillId === skillId);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [skillId]);

  if (!isLoading && !skill) {
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

  const canOrder = user && String(user.id) !== skill?.authorId && (user?.balance || 0) >= (skill?.price || 0);

  const handleOrder = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!skill) return;

    if ((user.balance || 0) < skill.price) {
      setError("Недостаточно средств. Пополните баланс.");
      return;
    }

    try {
      setIsOrdering(true);
      const orderId = await createOrder(skill.id, skill.authorId);
      setIsOrdering(false);
      setShowModal(false);
      router.push(`/order/${orderId}/chat`);
    } catch (err) {
      setError("Ошибка при создании заказа: " + (err instanceof Error ? err.message : ""));
      setIsOrdering(false);
    }
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
                  {skill?.category}
                </span>
                <h1 className="title" style={{ marginTop: 12 }}>
                  {skill?.title}
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
                    <Link href={`/profile/${skill?.authorId}`} style={{ color: "var(--color-primary)" }}>
                      {skill?.authorId}
                    </Link>
                  </p>
                  <p style={{ margin: "0 0 8px", fontSize: "13px" }}>
                    <b>Длительность:</b> {skill?.duration} мин
                  </p>
                  <p style={{ margin: 0, fontSize: "13px" }}>
                    <b>Рейтинг:</b> {skill?.rating.toFixed(1)} ({skillReviews.length} отзывов)
                  </p>
                </div>

                <h2 className="subtitle">Описание</h2>
                <p className="text-secondary" style={{ lineHeight: "1.6" }}>
                  {skill?.description}
                </p>

                {skill?.learnings && skill.learnings.length > 0 && (
                  <>
                    <h2 className="subtitle" style={{ marginTop: 24 }}>
                      Чему вы научитесь
                    </h2>
                    <ul style={{ paddingLeft: 20, margin: 0, color: "var(--color-text-secondary)", fontSize: "13px" }}>
                      {skill.learnings.map((item, idx) => (
                        <li key={idx} style={{ marginBottom: 8 }}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {skillReviews.length > 0 && (
                <div className="card">
                  <h2 className="subtitle">Отзывы ({skillReviews.length})</h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {skillReviews.map((review) => (
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
                          <span style={{ fontWeight: "600" }}>{review.fromUserId}</span>
                          <span style={{ color: "var(--color-text-tertiary)", fontSize: "12px" }}>
                            {new Date(review.createdAt).toLocaleDateString("ru-RU")}
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
              )}
            </div>

            <div>
              <div className="card" style={{ position: "sticky", top: 24 }}>
                <h2 className="subtitle" style={{ marginTop: 0 }}>
                  Информация о навыке
                </h2>

                {error && (
                  <div style={{ background: "#fee", padding: "8px 12px", borderRadius: "6px", fontSize: "12px", color: "#c33", marginBottom: "12px" }}>
                    {error}
                  </div>
                )}

                <div
                  style={{
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    padding: "16px",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginBottom: "4px" }}>
                    Цена урока
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--color-primary)" }}>
                    {skill?.price} ₽
                  </div>
                  {user && (
                    <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "8px" }}>
                      Ваш баланс: {user.balance} ₽
                      {(user.balance || 0) < (skill?.price || 0) && (
                        <div style={{ color: "#c33", fontWeight: "500", marginTop: "4px" }}>
                          Недостаточно средств
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "20px",
                    opacity: isOrdering ? 0.6 : 1,
                  }}
                  onClick={() => setShowModal(true)}
                  disabled={isOrdering || !canOrder}
                >
                  {isOrdering ? "Заказываю..." : "Заказать навык"}
                </button>

                {!user && (
                  <button
                    className="btn btn-secondary"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: "600",
                      marginBottom: "20px",
                    }}
                    onClick={() => router.push("/login")}
                  >
                    Войти для заказа
                  </button>
                )}

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
                    <Link href={`/profile/${skill?.authorId}`} style={{ color: "var(--color-primary)", fontWeight: "600" }}>
                      {skill?.authorId}
                    </Link>
                  </div>
                  <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
                    <span className="text-secondary">Категория</span>
                    <br />
                    <b>{skill?.category}</b>
                  </div>
                  <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "12px" }}>
                    <span className="text-secondary">Всего отзывов</span>
                    <br />
                    <b>{skillReviews.length}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              className="card"
              style={{
                maxWidth: "400px",
                width: "90%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Подтверждение заказа</h2>
              <div style={{ background: "var(--color-bg-secondary)", padding: "16px", borderRadius: "6px", marginTop: "16px", marginBottom: "16px" }}>
                <p style={{ margin: "0 0 8px", fontSize: "13px" }}>
                  <b>{skill?.title}</b>
                </p>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
                  Инструктор: {skill?.authorId}
                </p>
                <p style={{ margin: "0 0 8px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
                  Длительность: {skill?.duration} минут
                </p>
                <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: "600" }}>
                  Сумма: {skill?.price} ₽
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--color-text-secondary)" }}>
                  Ваш баланс: {user?.balance} ₽
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowModal(false)}
                  disabled={isOrdering}
                >
                  Отмена
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleOrder}
                  disabled={isOrdering || !canOrder}
                >
                  {isOrdering ? "Заказываю..." : "Подтвердить"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
