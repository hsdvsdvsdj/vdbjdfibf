"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

interface Props {
  userId: string;
}

interface User {
  id: number;
  login: string;
  nickname?: string;
  photo?: string;
  email?: string;
  bio?: string;
  is_verified: boolean;
}

export default function UserProfile({ userId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await api.getUserProfile(parseInt(userId));
        setUser(userData);
        setError(null);
      } catch (err) {
        setError("Ошибка при загрузке профиля");
        setUser(null);
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (loading) {
    return (
      <main className="page">
        <div className="container">
          <div className="card" style={{ padding: "32px", textAlign: "center" }}>
            <p>Загрузка профиля...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="page">
        <div className="container">
          <div
            className="card"
            style={{
              padding: "32px",
              borderRadius: "24px",
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                margin: "0 0 10px",
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--color-text-primary)",
              }}
            >
              Профиль не найден
            </h1>
            <p
              style={{
                margin: "0 0 20px",
                color: "var(--color-text-secondary)",
              }}
            >
              {error || "Такого пользователя не существует."}
            </p>
            <Link href="/search" className="btn btn-primary">
              Вернуться на поиск
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div
        className="container"
        style={{
          maxWidth: "1080px",
          display: "grid",
          gap: "20px",
        }}
      >
        {/* Главная карточка профиля */}
        <section
          className="card"
          style={{
            padding: "28px",
            borderRadius: "28px",
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: "24px",
              alignItems: "center",
            }}
          >
            {/* Аватар */}
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "var(--color-bg-tertiary)",
                border: "2px solid rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  color: "var(--color-primary)",
                  opacity: 0.9,
                }}
              >
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>

            {/* Инфо */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  marginBottom: "22px",
                }}
              >
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "32px",
                      fontWeight: 750,
                      color: "var(--color-text-primary)",
                      lineHeight: 1.1,
                    }}
                  >
                    {user.nickname || user.login}
                  </h1>

                  <div
                    style={{
                      marginTop: "10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#4ade80",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#4ade80",
                        display: "inline-block",
                      }}
                    />
                    {user.is_verified ? "Верифицирован" : "Активный участник"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Нижние блоки */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "20px",
          }}
        >
          {/* О себе */}
          <section
            className="card"
            style={{
              padding: "24px",
              borderRadius: "24px",
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h2
              style={{
                margin: "0 0 16px",
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--color-text-primary)",
              }}
            >
              О себе
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "var(--color-text-secondary)",
                lineHeight: "1.6",
              }}
            >
              {user.bio || "Информация о себе отсутствует"}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}