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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username.trim() || !password.trim() || !repeatPassword.trim()) {
      setError("Заполни все поля");
      setIsLoading(false);
      return;
    }

    if (password.length < 3) {
      setError("Пароль должен быть не менее 3 символов");
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const success = register(username.trim(), password);

      if (!success) {
        setError("Пользователь с таким логином уже существует");
        setIsLoading(false);
        return;
      }

      router.push("/home");
    }, 500);
  };

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card">
          <h1 className="title" style={{ textAlign: "center" }}>
            SkillSwap
          </h1>
          <p className="text-secondary" style={{ textAlign: "center", margin: "0 0 24px" }}>
            Создай аккаунт и начни обмениваться навыками
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="input-group">
              <label>Логин</label>
              <input
                type="text"
                placeholder="Выбери свой логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label>Пароль</label>
              <input
                type="password"
                placeholder="Не менее 3 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label>Повтори пароль</label>
              <input
                type="password"
                placeholder="Повтори пароль"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "#ffebee",
                  color: "#c62828",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  borderLeft: "3px solid #c62828",
                }}
              >
                {error}
              </div>
            )}

            <button
              className="btn btn-primary"
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "600",
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Загрузка..." : "Создать аккаунт"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}