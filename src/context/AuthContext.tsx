"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "../services/api";

export type UserRole = "user" | "moderator";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  balance: number;
  avatar?: string;
  bio?: string;
  rating?: number;
  reviewsCount?: number;
  skillsCount?: number;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialUsers: StoredUser[] = [
  {
    id: "1",
    username: "user",
    password: "user",
    role: "user",
    balance: 5000,
    avatar: "",
    bio: "",
    rating: 4.8,
    reviewsCount: 12,
    skillsCount: 3,
  },
  {
    id: "2",
    username: "moderator",
    password: "moderator",
    role: "moderator",
    balance: 0,
    avatar: "",
    bio: "",
    rating: 5,
    reviewsCount: 0,
    skillsCount: 0,
  },
];

function getSavedUsers(): StoredUser[] {
  if (typeof window === "undefined") return initialUsers;

  const raw = localStorage.getItem("users");
  if (!raw) {
    localStorage.setItem("users", JSON.stringify(initialUsers));
    return initialUsers;
  }

  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    localStorage.setItem("users", JSON.stringify(initialUsers));
    return initialUsers;
  }
}

function saveUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("users", JSON.stringify(users));
}

function stripPassword(user: StoredUser): User {
  const { password, ...rest } = user;
  return rest;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Переинициализируем токен из localStorage в ApiClient
        api.reloadToken();

        // Сначала проверяем localStorage на сохраненный access_token
        const savedToken = localStorage.getItem("access_token");
        if (savedToken) {
          // Устанавливаем токен в ApiClient и пытаемся загрузить пользователя
          try {
            const response = await api.getCurrentUser();
            if (response) {
              setUser(response);
              setHydrated(true);
              return;
            }
          } catch (userLoadError) {
            console.log("access_token истек, попытаемся обновить через refresh_token");
          }
        }

        // Если access_token недействителен или не существует, пытаемся обновить через refresh_token
        try {
          const refreshResponse = await api.refreshToken();
          if (refreshResponse && refreshResponse.access_token) {
            // Получаем информацию о пользователе с новым токеном
            const currentUser = await api.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
              setHydrated(true);
              return;
            }
          }
        } catch (refreshError) {
          // refresh_token тоже невалиден или истек
          console.log("refresh_token невалиден или истек");
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        console.log("Autoload failed, need to login", error);
        localStorage.removeItem("access_token");
      }

      setHydrated(true);
    };

    init();
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user, hydrated]);

  const login = async (username: string, password: string) => {
    try {
      await api.login(username, password);

      const currentUser = await api.getCurrentUser();
      setUser(currentUser);

      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      await api.register({ login: username, password });

      const currentUser = await api.getCurrentUser();
      setUser(currentUser);

      return true;
    } catch (error) {
      console.error("Register failed", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setUser(null);
    }
  };

  const updateBalance = (amount: number) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      balance: user.balance + amount,
    };

    setUser(updatedUser);

    const users = getSavedUsers();
    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, balance: updatedUser.balance } : u
    );
    saveUsers(updatedUsers);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}