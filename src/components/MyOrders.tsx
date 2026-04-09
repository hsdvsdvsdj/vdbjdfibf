"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { SkeletonCard } from "./Skeleton";

export default function MyOrders() {
  const router = useRouter();
  const { orders, skills, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Все");
  const [roleFilter, setRoleFilter] = useState("Все");

  const statuses = ["Все", "pending", "active", "completed", "rejected"];
  const statusLabels: Record<string, string> = {
    "Все": "Все",
    "pending": "Ожидает",
    "active": "В процессе",
    "completed": "Завершен",
    "rejected": "Отклонен"
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const statusMatch = statusFilter === "Все" || order.status === statusFilter;
    const role = order.studentId === user?.id ? "Ученик" : "Наставник";
    const roleMatch = roleFilter === "Все" || roleFilter === role;
    return statusMatch && roleMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return { bg: "#dcfce7", color: "#166534" };
      case "completed": return { bg: "#dbeafe", color: "#0c4a6e" };
      case "pending": return { bg: "#fef3c7", color: "#92400e" };
      default: return { bg: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" };
    }
  };

  return (
    <main className="page">
      <div className="container">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 24,
        }}>
          <h1 className="title" style={{ margin: 0 }}>Мои заказы</h1>
          <Link href="/search" className="btn btn-secondary">Найти навыки</Link>
        </div>

        {/* Фильтры */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div>
              <label style={{ fontSize: "12px", color: "var(--color-text-secondary)", display: "block", marginBottom: 8 }}>
                Статус
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg)",
                  color: "var(--color-text)",
                }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{statusLabels[s] || s}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--color-text-secondary)", display: "block", marginBottom: 8 }}>
                Роль
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg)",
                  color: "var(--color-text)",
                }}
              >
                {["Все", "Ученик", "Наставник"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Список заказов */}
        {isLoading ? (
          <div style={{ display: "grid", gap: 16 }}>
            {[1, 2, 3].map((i) => (<SkeletonCard key={i} />))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div style={{ display: "grid", gap: 16 }}>
            {filteredOrders.map((order) => {
              const skill = skills.find((s) => s.id === order.skillId);
              const role = order.studentId === user?.id ? "Ученик" : "Наставник";
              const colors = getStatusColor(order.status);
              
              return (
                <div
                  key={order.id}
                  className="card"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push(`/order/${order.id}/details`)}
                >
                  <div>
                    <h3 style={{ margin: "0 0 8px" }}>{skill?.title}</h3>
                    <p style={{ margin: "0 0 8px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                      {role === "Ученик" ? `Наставник: ${skill?.authorId}` : `Ученик: ${order.studentId}`}
                    </p>
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-secondary)" }}>
                      Цена: {order.price} ₽
                    </p>
                  </div>
                  <div style={{
                    ...colors,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: "600",
                    textAlign: "center",
                    minWidth: "120px",
                  }}>
                    {statusLabels[order.status]}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <p className="text-secondary">Нет заказов</p>
            <Link href="/search" className="btn btn-primary" style={{ marginTop: "16px", display: "inline-block" }}>
              Найти навыки
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
