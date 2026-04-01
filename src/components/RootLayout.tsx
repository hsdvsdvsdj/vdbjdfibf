"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function RootLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/register";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link
            href={isAuthenticated ? "/home" : "/"}
            className="title"
            style={{ margin: 0, fontSize: 24 }}
          >
            SkillSwap
          </Link>

          {!isPublicPage && isAuthenticated && (
            <nav className="nav">
              <Link
                href="/home"
                className={`nav-link ${pathname === "/home" ? "active" : ""}`}
              >
                Главная
              </Link>

              <Link
                href="/search"
                className={`nav-link ${pathname === "/search" ? "active" : ""}`}
              >
                Поиск
              </Link>

              <Link
                href="/orders"
                className={`nav-link ${pathname === "/orders" ? "active" : ""}`}
              >
                Заказы
              </Link>

              <Link
                href="/balance"
                className={`nav-link ${pathname === "/balance" ? "active" : ""}`}
              >
                Баланс
              </Link>

              <Link
                href="/reviews"
                className={`nav-link ${pathname === "/reviews" ? "active" : ""}`}
              >
                Отзывы
              </Link>

              <Link
                href="/profile"
                className={`nav-link ${pathname === "/profile" ? "active" : ""}`}
              >
                Профиль
              </Link>

              {user?.role === "moderator" && (
                <Link
                  href="/moderator"
                  className={`nav-link ${pathname === "/moderator" ? "active" : ""}`}
                >
                  Модерация
                </Link>
              )}

              <button className="btn btn-secondary" onClick={handleLogout}>
                Выйти
              </button>
            </nav>
          )}
        </div>
      </header>

      {children}
    </>
  );
}