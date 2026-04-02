"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function RootLayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/register";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <Link
            href={isAuthenticated ? "/home" : "/"}
            className="title"
            style={{ 
              margin: 0, 
              fontSize: 22, 
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <Logo />
            </div>
            SkillSwap
          </Link>

          <nav className="nav">
            {!isPublicPage && isAuthenticated ? (
              <>
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
                  className={`nav-link ${pathname === "/orders" || pathname.startsWith("/order") ? "active" : ""}`}
                >
                  Заказы
                </Link>
                <Link
                  href="/chat"
                  className={`nav-link ${pathname === "/chat" || pathname.includes("/chat") ? "active" : ""}`}
                >
                  Чат
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
                <button 
                  className="btn btn-primary" 
                  onClick={handleLogout}
                  style={{ padding: "8px 14px", fontSize: "13px", whiteSpace: "nowrap" }}
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-primary" style={{ padding: "8px 14px", fontSize: "13px" }}>
                  Вход
                </Link>
                <Link href="/register" className="btn btn-primary" style={{ padding: "8px 14px", fontSize: "13px" }}>
                  Регистрация
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {children}
    </>
  );
}