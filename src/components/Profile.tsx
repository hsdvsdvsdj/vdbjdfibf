"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="page">
        <div className="container">
          <div className="card">
            <h1 className="title">Профиль</h1>
            <p className="text-muted">Пользователь не авторизован.</p>
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
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="card">
          <h1 className="title">Мой профиль</h1>

          <div className="grid grid-2">
            <div className="card" style={{ background: "#f9fafb" }}>
              <h2 className="subtitle">Основная информация</h2>
              <p>
                <b>ID:</b> {user.id}
              </p>
              <p>
                <b>Логин:</b> {user.username}
              </p>
              <p>
                <b>Роль:</b> {user.role}
              </p>
            </div>

            <div className="card" style={{ background: "#f9fafb" }}>
              <h2 className="subtitle">Статистика</h2>
              <p>
                <b>Баланс:</b> {user.balance} ₽
              </p>
              <p>
                <b>Рейтинг:</b> {user.rating ?? 0}
              </p>
              <p>
                <b>Отзывы:</b> {user.reviewsCount ?? 0}
              </p>
              <p>
                <b>Навыков:</b> {user.skillsCount ?? 0}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/balance" className="btn btn-secondary">
              Перейти к балансу
            </Link>
            <Link href="/reviews" className="btn btn-secondary">
              Смотреть отзывы
            </Link>
            <Link href="/orders" className="btn btn-secondary">
              Мои заказы
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}