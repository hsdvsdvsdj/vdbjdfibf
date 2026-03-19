import Link from "next/link";

interface Props {
  userId: string;
}

const mockUsers = [
  {
    id: "3",
    username: "Алексей М.",
    role: "user",
    balance: 0,
    rating: 4.8,
    reviewsCount: 12,
    skillsCount: 3,
    about: "Преподаю игру на гитаре, люблю музыку и практический подход к обучению.",
  },
  {
    id: "4",
    username: "Мария К.",
    role: "user",
    balance: 0,
    rating: 4.9,
    reviewsCount: 24,
    skillsCount: 5,
    about: "Учу готовить вкусно и просто, люблю домашнюю кухню и суши.",
  },
  {
    id: "5",
    username: "Дмитрий С.",
    role: "user",
    balance: 0,
    rating: 4.7,
    reviewsCount: 18,
    skillsCount: 4,
    about: "Занимаюсь программированием и помогаю новичкам начать путь в IT.",
  },
];

export default function UserProfile({ userId }: Props) {
  const user = mockUsers.find((item) => item.id === userId);

  if (!user) {
    return (
      <main className="page">
        <div className="container">
          <div className="card">
            <h1 className="title">Профиль пользователя</h1>
            <p className="text-muted">Пользователь не найден.</p>
            <Link href="/home" className="btn btn-primary">
              На главную
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="card">
          <h1 className="title">{user.username}</h1>
          <p className="text-muted" style={{ marginBottom: 20 }}>
            Публичный профиль исполнителя
          </p>

          <div className="grid grid-2">
            <div className="card" style={{ background: "#f9fafb" }}>
              <h2 className="subtitle">О пользователе</h2>
              <p>
                <b>ID:</b> {user.id}
              </p>
              <p>
                <b>Роль:</b> {user.role}
              </p>
              <p>{user.about}</p>
            </div>

            <div className="card" style={{ background: "#f9fafb" }}>
              <h2 className="subtitle">Статистика</h2>
              <p>
                <b>Рейтинг:</b> {user.rating}
              </p>
              <p>
                <b>Отзывы:</b> {user.reviewsCount}
              </p>
              <p>
                <b>Навыков:</b> {user.skillsCount}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <Link href="/search" className="btn btn-secondary">
              Назад к поиску
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}