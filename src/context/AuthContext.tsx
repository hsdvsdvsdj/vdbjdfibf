"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type UserRole = "user" | "moderator";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  balance: number;
  avatar?: string;
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
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  logout: () => void;
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
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser) as User);
      } catch {
        localStorage.removeItem("currentUser");
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user, hydrated]);

  const login = (username: string, password: string) => {
    const users = getSavedUsers();
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) return false;

    setUser(stripPassword(foundUser));
    return true;
  };

  const register = (username: string, password: string) => {
    const users = getSavedUsers();

    const exists = users.some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (exists) return false;

    const newUser: StoredUser = {
      id: Date.now().toString(),
      username,
      password,
      role: "user",
      balance: 1000,
      avatar: "",
      rating: 0,
      reviewsCount: 0,
      skillsCount: 0,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    setUser(stripPassword(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
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