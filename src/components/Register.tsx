"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim() || !repeatPassword.trim()) {
      setError("Заполни все поля");
      return;
    }

    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }

    const success = register(username.trim(), password);

    if (!success) {
      setError("Пользователь с таким логином уже существует");
      return;
    }

    router.push("/home");
  };

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card">
          <h1 className="title">Регистрация</h1>

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

            <input
              className="input"
              type="password"
              placeholder="Повторите пароль"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />

            {error ? (
              <p style={{ color: "crimson", margin: 0 }}>{error}</p>
            ) : null}

            <button className="btn btn-primary" type="submit">
              Зарегистрироваться
            </button>
          </form>

          <p className="text-muted" style={{ marginTop: 16 }}>
            Уже есть аккаунт? <Link href="/login">Войти</Link>
          </p>
        </div>
      </div>
    </main>
  );
}