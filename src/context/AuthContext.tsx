"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "../services/api";

export interface User {
  id: number;
  login: string;
  email: string | null;
  nickname: string | null;
  photo: string | null;
  is_verified: boolean;
  balance?: number;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  author: string;
  authorId: string;
  rating: number;
  reviewCount: number;
  learnings: string[];
  reviews: Review[];
  createdAt: string;
}

export interface Order {
  id: string;
  skillId: string;
  skill: Skill;
  performerId: string;
  performer: string;
  studentId: string;
  student: string;
  status: "pending" | "active" | "completed" | "rejected";
  price: number;
  duration: number;
  createdAt: string;
  completedAt?: string;
  rating?: number;
}

export interface Review {
  id: string;
  orderId: string;
  skillId: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "topup" | "withdrawal" | "payment" | "earning";
  amount: number;
  description: string;
  balance: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<boolean>;
  register: (login: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // App State
  skills: Skill[];
  orders: Order[];
  reviews: Review[];
  transactions: Transaction[];
  
  // Create Skill
  createSkill: (skill: Omit<Skill, "id" | "authorId" | "author" | "rating" | "reviewCount" | "reviews" | "createdAt">) => Promise<string>;
  
  // Orders
  createOrder: (skillId: string, performerId: string) => Promise<string>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<void>;
  
  // Reviews & Ratings
  addReview: (orderId: string, skillId: string, rating: number, comment: string) => Promise<void>;
  
  // Balance
  updateBalance: (amount: number) => Promise<void>;
  addTransaction: (type: Transaction["type"], amount: number, description: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial mock skills
const INITIAL_SKILLS: Skill[] = [
  {
    id: "1",
    title: "Основы игры на гитаре",
    description: "Научись играть на гитаре с нуля",
    category: "Музыка",
    duration: 30,
    price: 500,
    author: "Алексей М.",
    authorId: "user2",
    rating: 4.8,
    reviewCount: 12,
    learnings: ["Аккорды", "Техника игры", "Популярные песни"],
    reviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Python для начинающих",
    description: "Полный курс для новичков",
    category: "Программирование",
    duration: 60,
    price: 1200,
    author: "Дмитрий С.",
    authorId: "user3",
    rating: 4.9,
    reviewCount: 24,
    learnings: ["Синтаксис", "Функции", "Модули"],
    reviews: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Приготовление суши",
    description: "Научись готовить аутентичные суши",
    category: "Кулинария",
    duration: 45,
    price: 800,
    author: "Мария К.",
    authorId: "user4",
    rating: 4.7,
    reviewCount: 18,
    learnings: ["Нарезка рыбы", "Формовка", "Соусы"],
    reviews: [],
    createdAt: new Date().toISOString(),
  },
];

function getSavedState() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem("appState");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(state: {
  skills: Skill[];
  orders: Order[];
  reviews: Review[];
  transactions: Transaction[];
  userBalance: number;
}) {
  if (typeof window === "undefined") return;
  localStorage.setItem("appState", JSON.stringify(state));
}

function getSavedUser(): User | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("currentUser");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function saveUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // App State
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        // Переинициализируем токен из localStorage в ApiClient
        api.reloadToken();

        // Загружаем текущего пользователя с API
        let currentUser = null;
        try {
          currentUser = await api.getCurrentUser();
        } catch (err) {
          console.log("User not authenticated");
          currentUser = null;
        }
        
        if (currentUser) {
          setUser({
            ...currentUser,
            balance: currentUser.balance || 5000,
          });

        // Загружаем все навыки с API (públicas, sem autenticação)
          try {
            const skillsResponse = await api.get("/skills?limit=100");
            const apiSkills = skillsResponse.map((skill: any) => ({
              id: String(skill.class_id),
              title: skill.title,
              description: skill.description || "",
              category: skill.category || "Другое",
              duration: skill.duration || 30,
              price: parseFloat(skill.cost) || 0,
              author: skill.user?.nickname || skill.user?.login || "Unknown",
              authorId: String(skill.user_id),
              rating: 0,
              reviewCount: 0,
              learnings: skill.learnings?.split("\n") || ["Основные навыки"],
              reviews: [],
              createdAt: new Date().toISOString(),
            }));
            setSkills(apiSkills.length > 0 ? apiSkills : INITIAL_SKILLS);
          } catch (err) {
            console.log("Skills loading failed, using initial:", err);
            setSkills(INITIAL_SKILLS);
          }

          // Загружаем заказы пользователя
          try {
            const ordersResponse = await api.get("/orders");
            const apiOrders = ordersResponse.map((order: any) => ({
              id: String(order.id_order),
              skillId: String(order.class_id),
              skill: {
                title: order.classified?.title || "Unknown",
              } as any,
              performerId: String(order.seller_id),
              performer: order.seller?.nickname || order.seller?.login || "Unknown",
              studentId: String(order.buyer_id),
              student: order.buyer?.nickname || order.buyer?.login || "Unknown",
              status: order.status.toLowerCase(),
              price: order.classified?.cost || 0,
              duration: order.classified?.duration || 30,
              createdAt: order.created_at || new Date().toISOString(),
            }));
            setOrders(apiOrders);
          } catch (err) {
            console.log("Orders loading failed:", err);
            setOrders([]);
          }
        } else {
          // Не авторизован, используем дефолтные значения
          setSkills(INITIAL_SKILLS);
          setOrders([]);
        }

        setHydrated(true);
      } catch (error) {
        console.log("Autoload failed", error);
        setSkills(INITIAL_SKILLS);
        setHydrated(true);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (!hydrated || !user) return;

    saveUser(user);
    saveState({
      skills,
      orders,
      reviews,
      transactions,
      userBalance: user.balance || 5000,
    });
  }, [user, skills, orders, reviews, transactions, hydrated]);

  const login = async (login: string, password: string) => {
    try {
      await api.login(login, password);
      api.reloadToken(); // Reload token from localStorage after successful login
      const currentUser = await api.getCurrentUser();
      setUser({
        ...(currentUser || { id: 1, login: "demo", email: null, nickname: null, photo: null, is_verified: false }),
        balance: 5000,
      });
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const register = async (login: string, password: string) => {
    try {
      await api.register({ login, password });
      api.reloadToken(); // Reload token from localStorage after successful registration
      const currentUser = await api.getCurrentUser();
      setUser({
        ...(currentUser || { id: 1, login: "demo", email: null, nickname: null, photo: null, is_verified: false }),
        balance: 5000,
      });
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
      saveUser(null);
    }
  };

  // App State Functions
  const createSkill = async (skillData: Omit<Skill, "id" | "authorId" | "author" | "rating" | "reviewCount" | "reviews" | "createdAt">) => {
    try {
      api.reloadToken(); // Refresh token from localStorage
      
      // Send to API
      const response = await api.post("/skills", {
        title: skillData.title,
        description: skillData.description,
        category: skillData.category,
        duration: skillData.duration,
        cost: skillData.price, // Price maps to cost in API
        coef_prom: 1.0,
        learnings: skillData.learnings?.join("\n") || "", // Convert array to newline-separated string
      });

      const newSkill: Skill = {
        ...skillData,
        id: String(response.class_id),
        authorId: String(user?.id || "1"),
        author: user?.nickname || user?.login || "Unknown",
        rating: 0,
        reviewCount: 0,
        reviews: [],
        createdAt: new Date().toISOString(),
      };

      setSkills([...skills, newSkill]);
      return newSkill.id;
    } catch (error) {
      console.error("Failed to create skill:", error);
      throw error;
    }
  };

  const createOrder = async (skillId: string, performerId: string) => {
    try {
      api.reloadToken(); // Refresh token from localStorage
      
      const skill = skills.find((s) => s.id === skillId);
      if (!skill) throw new Error("Skill not found");

      // Send order to API
      const response = await api.post("/orders", {
        class_id: parseInt(skillId),
      });

      const newOrder: Order = {
        id: String(response.id_order),
        skillId,
        skill,
        performerId,
        performer: skill.author,
        studentId: String(user?.id || "1"),
        student: user?.nickname || user?.login || "Unknown",
        status: response.status.toLowerCase(),
        price: skill.price,
        duration: skill.duration,
        createdAt: response.created_at || new Date().toISOString(),
      };

      setOrders([...orders, newOrder]);

      // Update balance
      if (user) {
        setUser({
          ...user,
          balance: (user.balance || 0) - skill.price,
        });

        // Add transaction
        setTransactions([
          ...transactions,
          {
            id: `txn_${Date.now()}`,
            type: "payment",
            amount: -skill.price,
            description: `Оплата за ${skill.title}`,
            balance: (user.balance || 0) - skill.price,
            createdAt: new Date().toISOString(),
          },
        ]);
      }

      return newOrder.id;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      api.reloadToken(); // Refresh token from localStorage
      
      // Send status update to API
      await api.put(`/orders/${orderId}?status=${status}`);

      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status, completedAt: status === "completed" ? new Date().toISOString() : order.completedAt } : order
        )
      );
    } catch (error) {
      console.error("Failed to update order status:", error);
      throw error;
    }
  };

  const addReview = async (orderId: string, skillId: string, rating: number, comment: string) => {
    try {
      api.reloadToken(); // Refresh token from localStorage
      
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      // Send review to API
      await api.post("/reviews", {
        class_id: parseInt(skillId),
        description: comment,
        mark: rating,
      });

      const newReview: Review = {
        id: `review_${Date.now()}`,
        orderId,
        skillId,
        fromUserId: String(user?.id || "1"),
        fromUserName: user?.nickname || user?.login || "Unknown",
        toUserId: order.performerId,
        toUserName: order.performer,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      setReviews([...reviews, newReview]);

      // Update skill rating
      const skillReviews = [...reviews, newReview].filter((r) => r.skillId === skillId);
      const avgRating = skillReviews.reduce((sum, r) => sum + r.rating, 0) / skillReviews.length;

      setSkills(
        skills.map((skill) =>
          skill.id === skillId ? { ...skill, rating: avgRating, reviewCount: skillReviews.length, reviews: skillReviews } : skill
        )
      );

      // Mark order as completed
      updateOrderStatus(orderId, "completed");

      // Add earning transaction for performer
      setTransactions([
        ...transactions,
        {
          id: `txn_${Date.now()}`,
          type: "earning",
          amount: order.price * 0.9, // 90% to performer
          description: `Заработок за ${order.skill.title}`,
          balance: (user?.balance || 0),
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Failed to add review:", error);
      throw error;
    }
  };

  const updateBalance = async (amount: number) => {
    try {
      api.reloadToken(); // Refresh token from localStorage
      
      if (!user) return;

      const newBalance = (user.balance || 0) + amount;
      
      // Update user profile with new balance via API
      await api.put("/users/me", {
        balance: newBalance,
      });

      setUser({
        ...user,
        balance: newBalance,
      });

      setTransactions([
        ...transactions,
        {
          id: `txn_${Date.now()}`,
          type: amount > 0 ? "topup" : "withdrawal",
          amount,
          description: amount > 0 ? "Пополнение баланса" : "Вывод средств",
          balance: newBalance,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Failed to update balance:", error);
      throw error;
    }
  };

  const addTransaction = async (type: Transaction["type"], amount: number, description: string) => {
    try {
      api.reloadToken(); // Refresh token from localStorage
      
      if (!user) return;

      const newBalance = (user.balance || 0) + (type === "topup" || type === "earning" ? amount : -amount);

      // Update user profile with new balance via API
      await api.put("/users/me", {
        balance: newBalance,
      });

      setUser({
        ...user,
        balance: newBalance,
      });

      setTransactions([
        ...transactions,
        {
          id: `txn_${Date.now()}`,
          type,
          amount,
          description,
          balance: newBalance,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Failed to add transaction:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        skills,
        orders,
        reviews,
        transactions,
        createSkill,
        createOrder,
        updateOrderStatus,
        addReview,
        updateBalance,
        addTransaction,
      }}
    >
      {hydrated ? children : null}
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