"use client";

import { useAuth } from "../context/AuthContext";

export default function Balance() {
  const { user, updateBalance } = useAuth();

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="card">
          <h1 className="title">Баланс</h1>

          <p style={{ fontSize: 20, marginBottom: 20 }}>
            Текущий баланс: <b>{user?.balance ?? 0} ₽</b>
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              onClick={() => updateBalance(500)}
            >
              Пополнить на 500 ₽
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => updateBalance(1000)}
            >
              Пополнить на 1000 ₽
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => updateBalance(-1000)}
            >
              Списать 1000 ₽
            </button>
          </div>

          <div className="card" style={{ marginTop: 20, background: "#f9fafb" }}>
            <p className="text-muted" style={{ margin: 0 }}>
              Тестинг пополнение и списание средств
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}