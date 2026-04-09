"use client";

import Link from "next/link";
import React from "react";

export default function ReviewModal() {
  return (
    <div className="container">
      <h1 className="title">Программирование на Python</h1>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ background: "#0f1724", height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: "#cbd5e1" }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>🎥</div>
            <div style={{ fontWeight: 600 }}>Предварительный просмотр видео</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>В реальном приложении здесь будет видеоплеер</div>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Наставник</div>
              <div style={{ fontWeight: 700 }}>Дмитрий С.</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Студент</div>
              <div style={{ fontWeight: 700 }}>Анна В.</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Длительность</div>
              <div style={{ fontWeight: 700 }}>55м</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Статус</div>
              <div style={{ display: "inline-block", padding: "6px 12px", background: "#fef3c7", borderRadius: 20, fontWeight: 600 }}>На проверке</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            <button className="btn btn-secondary">Закрыть</button>
            <button className="btn" style={{ background: "#ef4444", color: "white", border: "none" }}>Отклонить</button>
            <button className="btn" style={{ background: "#10b981", color: "white", border: "none" }}>Одобрить</button>
          </div>
        </div>
      </div>
    </div>
  );
}
