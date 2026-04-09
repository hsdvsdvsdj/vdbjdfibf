"use client";

import React, { useState } from "react";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  minAmount?: number;
  maxAmount?: number;
}

export default function TopUpModal({
  isOpen,
  onClose,
  onConfirm,
  minAmount = 100,
  maxAmount = 100000,
}: TopUpModalProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const value = parseInt(amount);

    if (!amount.trim()) {
      setError("Введите сумму");
      return;
    }

    if (isNaN(value)) {
      setError("Введите корректное число");
      return;
    }

    if (value < minAmount) {
      setError(`Минимальная сумма: ${minAmount} РУБ`);
      return;
    }

    if (value > maxAmount) {
      setError(`Максимальная сумма: ${maxAmount} РУБ`);
      return;
    }

    setError("");
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    onConfirm(value);
    setAmount("");
    setIsLoading(false);
    onClose();
  };

  return (
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
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, marginBottom: 20 }}>Пополнить баланс</h2>

        {error && (
          <div
            style={{
              background: "#fee",
              color: "#c33",
              padding: "10px 12px",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "16px",
              border: "1px solid #fcc",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              color: "var(--color-text-secondary)",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Сумма пополнения (РУБ)
          </label>
          <input
            type="number"
            placeholder={`От ${minAmount} до ${maxAmount} РУБ`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            min={minAmount}
            max={maxAmount}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-secondary)",
              color: "var(--color-text)",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onClose}
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Пополнение..." : "Пополнить"}
          </button>
        </div>
      </div>

      <style jsx>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
