import React from "react";
import ReviewModal from "../../components/modals/ReviewModal";
import WithdrawModal from "../../components/modals/WithdrawModal";
import TopUpModal from "../../components/modals/TopUpModal";
import ConfirmOrderModal from "../../components/modals/ConfirmOrderModal";

export default function DemoWindowsPage() {
  return (
    <main className="page">
      <div className="container">
        <h1 className="title">Демонстрация окон (в стиле проекта)</h1>

        <section style={{ marginBottom: 32 }}>
          <h2>Окно модерации видео</h2>
          <ReviewModal />
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
          <div>
            <h2>Вывод средств</h2>
            <WithdrawModal />
          </div>
          <div>
            <h2>Пополнение баланса</h2>
            <TopUpModal />
          </div>
        </section>

        <section>
          <h2>Подтверждение заказа</h2>
          <ConfirmOrderModal />
        </section>
      </div>
    </main>
  );
}
