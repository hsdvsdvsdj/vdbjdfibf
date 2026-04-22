"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bio, setBio] = useState(user?.bio || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBio = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      const api = (await import("../services/api")).api;
      await api.updateUserProfile({ bio });
      setIsSaving(false);
    } catch (err) {
      console.error("Failed to save bio:", err);
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="page">
        <div className="container" style={{ maxWidth: "760px" }}>
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
              Профиль
            </h1>
            <p
              style={{
                margin: "0 0 20px",
                color: "var(--color-text-secondary)",
              }}
            >
              Пользователь не авторизован.
            </p>
            <Link href="/login" className="btn btn-primary">
              Войти
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
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
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
                )}
              </div>

              <label style={{ width: "120px" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    (
                      e.currentTarget.parentElement?.querySelector(
                        "input"
                      ) as HTMLInputElement
                    )?.click();
                  }}
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "12px",
                    border: "1px solid var(--color-border)",
                    background: "transparent",
                    color: "var(--color-text-primary)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Изменить фото
                </button>
              </label>
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
                    {user.login}
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
                    Активный участник
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    href="/create-skill"
                    className="btn btn-primary"
                    style={{
                      borderRadius: "12px",
                      padding: "11px 16px",
                    }}
                  >
                    Добавить навык
                  </Link>

                  <Link
                    href="/orders"
                    style={{
                      textDecoration: "none",
                      borderRadius: "12px",
                      padding: "11px 16px",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                      background: "transparent",
                      fontWeight: 600,
                    }}
                  >
                    Заказы
                  </Link>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "14px",
                }}
              >
                <StatCard value={user.rating ?? 0} label="Рейтинг" />
                <StatCard value={user.skillsCount ?? 0} label="Навыков" />
                <StatCard value={user.reviewsCount ?? 0} label="Отзывов" />
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

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Расскажите о себе, опыте, направлениях и навыках..."
              style={{
                width: "100%",
                minHeight: "150px",
                padding: "14px 16px",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-tertiary)",
                color: "var(--color-text-primary)",
                resize: "vertical",
                outline: "none",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            />

            <div
              style={{
                marginTop: "14px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                }}
              >
                {bio.length}/300
              </span>

              <button
                type="button"
                className="btn btn-primary"
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                }}
              >
                Сохранить
              </button>
            </div>
          </section>

          {/* Правая колонка */}
          <div style={{ display: "grid", gap: "20px" }}>
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
                Информация
              </h2>

              <InfoRow label="Участник с" value="Март 2026" />
              <InfoRow label="Статус" value="Активный" accent />
            </section>

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
              </h2>

              <div style={{ display: "grid", gap: "10px" }}>
                <QuickLink href="/search" label="Поиск навыков" />
                <QuickLink href="/orders" label="Мои заказы" />
                <QuickLink href="/reviews" label="Отзывы" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "18px",
        background: "var(--color-bg-tertiary)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          fontWeight: 750,
          color: "var(--color-text-primary)",
          marginBottom: "6px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "var(--color-text-secondary)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <span
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "14px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: accent ? "var(--color-primary)" : "var(--color-text-primary)",
          fontSize: "14px",
          fontWeight: 650,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function QuickLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        padding: "14px 16px",
        borderRadius: "14px",
        background: "var(--color-bg-tertiary)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-primary)",
        fontWeight: 600,
        fontSize: "14px",
      }}
    >
      {label}
    </Link>
  );
}