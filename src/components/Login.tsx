"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Заполни логин и пароль");
      return;
    }

    const success = login(username.trim(), password);

    if (!success) {
      setError("Неверный логин или пароль");
      return;
    }

    router.push("/home");
  };

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card">
          <h1 className="title">Вход</h1>

          <form className="form" onSubmit={handleSubmit}>
            <input
              className="input"
              type="text"
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="input"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error ? (
              <p style={{ color: "crimson", margin: 0 }}>{error}</p>
            ) : null}

            <button className="btn btn-primary" type="submit">
              Войти
            </button>
          </form>

          <p className="text-muted" style={{ marginTop: 16 }}>
            Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
          </p>

          <div className="card" style={{ marginTop: 16, background: "#f9fafb" }}>
            <p style={{ margin: 0 }}>
              Тестовый пользователь: <b>user / user</b>
            </p>
            <p style={{ margin: "8px 0 0" }}>
              Модератор: <b>moderator / moderator</b>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}