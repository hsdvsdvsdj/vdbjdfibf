"use client";

import Link from "next/link";

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

export default function MyOrders() {
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
            marginBottom: 20,
          }}
        >
          <h1 className="title" style={{ margin: 0 }}>
            Мои заказы
          </h1>

          <Link href="/search" className="btn btn-secondary">
            Найти еще навыки
          </Link>
        </div>

        <div className="list">
          {mockOrders.map((order) => (
            <div key={order.id} className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
                <div>
                  <h2 className="subtitle" style={{ marginBottom: 8 }}>
                    {order.skillTitle}
                  </h2>
                  <p style={{ margin: "0 0 6px" }}>
                    <b>Исполнитель:</b> {order.performer}
                  </p>
                  <p style={{ margin: 0 }}>
                    <b>Стоимость:</b> {order.price} ₽
                  </p>
                </div>

                <div>
                  <span className="badge">{order.status}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href={`/order/${order.id}/chat`} className="btn btn-primary">
                  Открыть чат
                </Link>

                <Link href="/reviews" className="btn btn-secondary">
                  Оставить отзыв
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}