import Link from "next/link";

export default function Landing() {
  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <span className="badge">Обмен навыками</span>
          <h1>SkillSwap — платформа для обмена знаниями и услугами</h1>
          <p>
            Находи людей, которые помогут тебе освоить новый навык, или сам
            предлагай свои знания другим. Удобный поиск, заказы, отзывы и чат в
            одном месте.
          </p>


        </section>

        <section className="grid grid-3">
          <div className="card">
            <h3 className="subtitle">Изучай новое</h3>
            <p className="text-muted">
              Ищи навыки по категориям и выбирай исполнителей по рейтингу и
              отзывам.
            </p>
          </div>

          <div className="card">
            <h3 className="subtitle">Предлагай свои знания</h3>
            <p className="text-muted">
              Создавай собственные навыки и помогай другим зарабатывать на своем
              опыте.
            </p>
          </div>

          <div className="card">
            <h3 className="subtitle">Общайся и заказывай</h3>
            <p className="text-muted">
              Оформляй заказ, общайся в чате и оставляй отзывы после завершения.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}