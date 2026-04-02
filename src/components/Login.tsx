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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError("Заполни логин и пароль");
      setIsLoading(false);
      return;
    }

    const success = await login(username.trim(), password);

    if (!success) {
      setError("Неверный логин или пароль");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  };

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card">
          <h1 className="title" style={{ textAlign: "center" }}>
            SkillSwap
          </h1>
          <p className="text-secondary" style={{ textAlign: "center", margin: "0 0 32px", fontSize: "20px", fontWeight: 600 }}>
            Вход в аккаунт
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="input-group">
              <label>Логин</label>
              <input
                type="text"
                placeholder="Введи свой логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label>Пароль</label>
              <input
                type="password"
                placeholder="Введи свой пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? "Загрузка..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}