const mockReviews = [
  {
    id: "1",
    author: "Анна",
    text: "Очень понравилась работа, все объяснили быстро и понятно.",
    rating: 5,
    date: "11.03.2026",
  },
  {
    id: "2",
    author: "Сергей",
    text: "Хороший исполнитель, рекомендую.",
    rating: 4,
    date: "08.03.2026",
  },
  {
    id: "3",
    author: "Марина",
    text: "Все было качественно, осталась довольна.",
    rating: 5,
    date: "03.03.2026",
  },
];

export default function Reviews() {
  return (
    <main className="page">
      <div className="container">
        <h1 className="title">Отзывы</h1>

        <div className="list">
          {mockReviews.map((review) => (
            <div key={review.id} className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 8,
                }}
              >
                <b>{review.author}</b>
                <span className="text-muted">{review.date}</span>
              </div>

              <p style={{ margin: "0 0 8px" }}>Оценка: {review.rating}/5</p>
              <p style={{ margin: 0 }}>{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}