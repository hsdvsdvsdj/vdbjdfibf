import Link from "next/link";

const mockOrders: Record<string, any> = {
  "101": {
    id: "101",
    skillTitle: "Основы игры на гитаре",
    performer: "Алексей М.",
    price: 500,
    status: "Активен",
    description: "Обучение базовым навыкам игры на гитаре для начинающих",
    startDate: "15.03.2026",
    endDate: "28.03.2026",
  },
  "102": {
    id: "102",
    skillTitle: "Python для начинающих",
    performer: "Дмитрий С.",
    price: 1200,
    status: "Завершен",
    description: "Полный курс по основам программирования на Python",
    startDate: "01.03.2026",
    endDate: "25.03.2026",
  },
  "103": {
    id: "103",
    skillTitle: "Приготовление суши",
    performer: "Мария К.",
    price: 800,
    status: "Ожидает",
    description: "Мастер-класс по приготовлению традиционного суши",
    startDate: "28.03.2026",
    endDate: "04.04.2026",
  },
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Активен":
      return { bg: "#dcfce7", color: "#166534", text: "Активен" };
    case "Завершен":
      return { bg: "#dbeafe", color: "#0c4a6e", text: "Завершен" };
    case "Ожидает":
      return { bg: "#fef3c7", color: "#92400e", text: "Ожидает" };
    default:
      return { bg: "var(--color-bg-secondary)", color: "var(--color-text-secondary)", text: "Неизвестный" };
  }
};

export default function OrderDetails({ orderId }: { orderId: string }) {
  const order = mockOrders[orderId];

  if (!order) {
    return (
      <main className="page">
        <div className="container">
          <h1 className="title" style={{ marginBottom: "24px" }}>Заказ не найден</h1>
          <Link href="/orders" className="btn btn-primary">Вернуться к заказам</Link>
        </div>
      </main>
    );
  }

  const statusColor = getStatusColor(order.status);

  return (
    <main className="page">
      <div className="container">
        <Link href="/orders" style={{ color: "var(--color-primary)", marginBottom: "24px", textDecoration: "none", fontSize: "14px" }}>
          ← Вернуться к заказам
        </Link>

        <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "24px", marginBottom: "24px", flexWrap: "wrap" }}>
            <div>
              <h1 className="title" style={{ marginBottom: "16px" }}>{order.skillTitle}</h1>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "12px" }}>
                <b>Исполнитель:</b> {order.performer}
              </p>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-secondary)" }}>
                <b>Описание:</b> {order.description}
              </p>
            </div>

            <span style={{
              background: statusColor.bg,
              color: statusColor.color,
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              whiteSpace: "nowrap"
            }}>
              ● {statusColor.text}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
            <div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "var(--color-text-primary)" }}>Дата начала</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-secondary)" }}>{order.startDate}</p>
            </div>
            <div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "var(--color-text-primary)" }}>Дата окончания</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-secondary)" }}>{order.endDate}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href={`/order/${orderId}/chat`} className="btn btn-primary">
              Перейти в чат
            </Link>
            <Link href="/orders" className="btn btn-secondary">
              Остальные заказы
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
