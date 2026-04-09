"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import TopUpModal from "./modals/TopUpModal";
import WithdrawModal from "./modals/WithdrawModal";

export default function Balance() {
  const { user, transactions, updateBalance } = useAuth();
  const router = useRouter();
  const [showTopUp, setShowTopUp] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const handleTopUp = async (amount: number) => {
    try {
      await updateBalance(amount);
      setShowTopUp(false);
    } catch (error) {
      console.error("Failed to topup balance:", error);
    }
  };

  const handleWithdraw = async (amount: number) => {
    if ((user?.balance || 0) >= amount) {
      try {
        await updateBalance(-amount);
        setShowWithdraw(false);
      } catch (error) {
        console.error("Failed to withdraw balance:", error);
      }
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      topup: "Пополнение",
      withdrawal: "Вывод",
      payment: "Оплата",
      earning: "Заработок"
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "topup":
      case "earning":
        return { color: "#2d5016", bg: "#dcfce7" };
      case "withdrawal":
      case "payment":
        return { color: "#7c2d12", bg: "#fed7aa" };
      default:
        return { color: "var(--color-text-secondary)", bg: "var(--color-bg-secondary)" };
    }
  };

  const getTransactionIcon = (type: string) => {
    const icons: Record<string, string> = {
      topup: "",
      withdrawal: "",
      payment: "",
      earning: ""
    };
    return icons[type] || "•";
  };

  return (
    <main className="page">
      <div className="container">
        <h1 className="title" style={{ marginBottom: 24 }}>Баланс и транзакции</h1>

        {/* Текущий баланс - темная карточка */}
        <div className="card" style={{ background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)", color: "white", marginBottom: 24, padding: "24px", borderRadius: "12px" }}>
          <p style={{ margin: "0 0 8px", color: "#dbeafe", fontSize: "13px", fontWeight: "500" }}>Текущий баланс</p>
          <div style={{ fontSize: "42px", fontWeight: "700", margin: "8px 0 20px", color: "#fff" }}>
            {user?.balance} Р
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="btn btn-primary" onClick={() => setShowTopUp(true)} style={{ flex: 1 }}>
              Пополнить
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowWithdraw(true)} 
              style={{ flex: 1 }}
              disabled={(user?.balance || 0) < 100}
            >
              Вывести
            </button>
          </div>
        </div>

        {/* Статистика - две карточки рядом */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
          <div className="card">
            <p style={{ margin: "0 0 8px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Доход</p>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#2d5016" }}>
              +{transactions.filter(t => t.type === "earning").reduce((sum, t) => sum + t.amount, 0)} Р
            </div>
          </div>
          <div className="card">
            <p style={{ margin: "0 0 8px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Расход</p>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#7c2d12" }}>
              -{transactions.filter(t => t.type === "payment").reduce((sum, t) => sum + t.amount, 0)} Р
            </div>
          </div>
        </div>

        {/* История транзакций */}
        <div className="card">
          <h2 style={{ marginTop: 0, marginBottom: 16 }}>История транзакций</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((tx) => {
                const colors = getTypeColor(tx.type);
                const icon = getTransactionIcon(tx.type);
                return (
                  <div
                    key={tx.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "var(--color-bg-secondary)",
                      borderRadius: "8px",
                      borderLeft: `4px solid ${colors.color}`,
                    }}
                  >
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <div style={{ fontSize: "20px", marginTop: "2px" }}>{icon}</div>
                      <div>
                        <p style={{ margin: "0 0 4px", fontWeight: "500", fontSize: "13px", color: colors.color }}>
                          {getTypeLabel(tx.type)}
                        </p>
                        <p style={{ margin: 0, fontSize: "12px", color: "var(--color-text-secondary)" }}>
                          {tx.description}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "600", fontSize: "14px", color: colors.color }}>
                        {tx.type === "payment" || tx.type === "withdrawal" ? "-" : "+"}{tx.amount} Р
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                        {new Date(tx.createdAt).toLocaleDateString("ru-RU")}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-secondary">Нет операций</p>
            )}
          </div>
        </div>
      </div>

      {showTopUp && <TopUpModal isOpen={showTopUp} onClose={() => setShowTopUp(false)} onConfirm={handleTopUp} />}
      {showWithdraw && <WithdrawModal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} onConfirm={handleWithdraw} availableAmount={user?.balance || 0} />}
    </main>
  );
}
