const mockReports = [
  {
    id: "1",
    user: "user123",
    reason: "Спам в описании навыка",
    status: "На проверке",
  },
  {
    id: "2",
    user: "test_user",
    reason: "Оскорбительное сообщение в чате",
    status: "Открыто",
  },
  {
    id: "3",
    user: "bad_actor",
    reason: "Нарушение правил платформы",
    status: "Ожидает решения",
  },
];

export default function ModeratorPanel() {
  return (
    <main className="page">
      <div className="container">
        <h1 className="title">Панель модератора</h1>

        <div className="list">
          {mockReports.map((report) => (
            <div key={report.id} className="card">
              <p>
                <b>ID жалобы:</b> {report.id}
              </p>
              <p>
                <b>Пользователь:</b> {report.user}
              </p>
              <p>
                <b>Причина:</b> {report.reason}
              </p>
              <p>
                <b>Статус:</b> {report.status}
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                <button className="btn btn-secondary">Отклонить</button>
                <button className="btn btn-primary">Подтвердить</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}