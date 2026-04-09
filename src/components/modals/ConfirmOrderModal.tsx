"use client";

import React, { useState } from "react";

interface ConfirmOrderModalProps {
  skillTitle?: string;
  instructor?: string;
  duration?: number;
  price?: number;
  userBalance?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
  isOpen?: boolean;
}

export default function ConfirmOrderModal({
  skillTitle = "Python для начинающих",
  instructor = "Дмитрий С.",
  duration = 60,
  price = 1200,
  userBalance = 5000,
  onConfirm,
  onCancel,
  isOpen = true,
}: ConfirmOrderModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (userBalance < price) {
      setError("Недостаточно средств на балансе");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);

    onConfirm?.();
  };

  if (!isOpen) return null;

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Подтверждение заказа</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, marginBottom: 16 }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>Навык:</div>
          <div style={{ fontWeight: 700, fontSize: "13px" }}>{skillTitle}</div>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>Наставник:</div>
          <div style={{ fontWeight: 600, fontSize: "13px" }}>{instructor}</div>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>Длительность:</div>
          <div style={{ fontWeight: 600, fontSize: "13px" }}>{duration} мин</div>
        </div>

        <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid var(--color-border)" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "14px" }}>Итого:</div>
          <div style={{ fontWeight: 700, fontSize: "18px", color: "var(--color-primary)" }}>
            {price} ₽
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            background: userBalance >= price ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            borderRadius: "6px",
            marginBottom: 16,
            color: userBalance >= price ? "#10b981" : "#ef4444",
            fontSize: "13px",
          }}
        >
          Ваш баланс:{" "}
          <span style={{ fontWeight: 700 }}>
            {userBalance} ₽
          </span>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: 16,
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button
            className="btn"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              flex: 1,
              background: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Отмена
          </button>
          <button
            className="btn"
            onClick={handleConfirm}
            disabled={isLoading || userBalance < price}
            style={{
              flex: 1,
              background: userBalance >= price ? "var(--color-primary)" : "var(--color-border)",
              color: "white",
              border: "none",
              opacity: isLoading || userBalance < price ? 0.6 : 1,
              cursor: isLoading || userBalance < price ? "not-allowed" : "pointer",
            }}
          >
            {isLoading ? "Обработка..." : "Оплатить"}
          </button>
        </div>
      </div>
    </div>
  );
}
