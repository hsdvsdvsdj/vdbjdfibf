import Link from "next/link";

export default function NotFoundComponent() {
  return (
    <main className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h1 className="title">404</h1>
          <p className="text-muted">Страница не найдена</p>

          <div style={{ marginTop: 20 }}>
            <Link href="/" className="btn btn-primary">
              На главную
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}