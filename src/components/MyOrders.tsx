"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SkeletonCard } from "./Skeleton";

const mockOrders = [
  {
    id: "101",
    skillTitle: "Основы игры на гитаре",
    performer: "Алексей М.",
    price: 500,
    status: "Активен",
  },
  {
    id: "102",
    skillTitle: "Python для начинающих",
    performer: "Дмитрий С.",
    price: 1200,
    status: "Завершен",
  },
  {
    id: "103",
    skillTitle: "Приготовление суши",
    performer: "Мария К.",
    price: 800,
    status: "Ожидает",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Активен":
      return { bg: "#dcfce7", color: "#166534", text: "●" };
    case "Завершен":
      return { bg: "#dbeafe", color: "#0c4a6e", text: "●" };
    case "Ожидает":
      return { bg: "#fef3c7", color: "#92400e", text: "●" };
    default:
      return { bg: "var(--color-bg-secondary)", color: "var(--color-text-secondary)", text: "●" };
  }
};

export default function MyOrders() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleOrderClick = (orderId: string) => {
    router.push(`/order/${orderId}/details`);
  };

  return (
    <main className="page">
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <h1 className="title" style={{ margin: 0 }}>
            Мои заказы
          </h1>

          <Link href="/search" className="btn btn-secondary">
            Найти еще навыки
          </Link>
        </div>

        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : mockOrders.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mockOrders.map((order) => {
              const statusColor = getStatusColor(order.status);
              return (
                <div
                  key={order.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOrderClick(order.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOrderClick(order.id);
                    }
                  }}
                  style={{ cursor: "pointer", display: "block", textDecoration: "none" }}
                >
                  <div className="card">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <h2 className="subtitle" style={{ marginBottom: 8 }}>
                          {order.skillTitle}
                        </h2>
                        <p style={{ margin: "0 0 6px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                          <b>Исполнитель:</b> {order.performer}
                        </p>
                      </div>

                      <span
                        style={{
                          background: statusColor.bg,
                          color: statusColor.color,
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {statusColor.text} {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <h2 className="subtitle">У вас нет заказов</h2>
            <p className="text-secondary" style={{ marginBottom: 20 }}>
              Начните с поиска навыков, которые вас интересуют
            </p>
            <Link href="/search" className="btn btn-primary">
              🔍 Перейти к поиску
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}