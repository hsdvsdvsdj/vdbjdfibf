import { api } from "@/services/api";

// API для работы с пользователями
export const usersApi = {
  getMe: () => api.get("/users/me"),
  getById: (id: number) => api.get(`/users/${id}`),
  update: (data: any) => api.put("/users/me", data),
};

// API для работы с навыками (skills/classifieds)
export const skillsApi = {
  getAll: (params?: any) => api.get("/skills", params),
  getById: (id: string | number) => api.get(`/skills/${id}`),
  create: (data: any) => api.post("/skills", data),
  update: (id: string | number, data: any) => api.put(`/skills/${id}`, data),
  delete: (id: string | number) => api.delete(`/skills/${id}`),
  getByCategory: (category: string) => api.get("/skills", { category }),
  getByUser: (userId: number) => api.get("/skills", { user_id: userId }),
};

// API для работы с заказами
export const ordersApi = {
  getAll: (params?: any) => api.get("/orders", params),
  getById: (id: string | number) => api.get(`/orders/${id}`),
  create: (data: any) => api.post("/orders", data),
  updateStatus: (id: string | number, status: string) => api.put(`/orders/${id}`, { status }),
  getByRole: (role: "buyer" | "seller", params?: any) => api.get("/orders", { role, ...params }),
};

// API для работы с отзывами
export const reviewsApi = {
  create: (data: any) => api.post("/reviews", data),
  getBySkill: (skillId: string | number) => api.get(`/skills/${skillId}/reviews`),
};

// API для работы с чатами и сообщениями
export const chatsApi = {
  getOrderChat: (orderId: number) => api.get(`/chats/order/${orderId}`),
  sendMessage: (orderId: number, message: string) => api.post(`/chats/order/${orderId}/message`, { message }),
  getAll: (params?: any) => api.get("/chats", params),
  getById: (id: string | number) => api.get(`/chats/${id}`),
  create: (data: any) => api.post("/chats", data),
  getUserChats: (userId: number) => api.get("/chats", { user_id: userId }),
};

// API для работы с категориями
export const categoriesApi = {
  getAll: () => api.get("/categories"),
  getById: (id: string | number) => api.get(`/categories/${id}`),
  create: (data: any) => api.post("/categories", data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
  getSkillCategories: (skillId: number) => api.get(`/categories/${skillId}/categories`),
  addCategoryToSkill: (skillId: number, categoryId: number) => api.post(`/categories/${skillId}/categories/${categoryId}`, {}),
  removeCategoryFromSkill: (skillId: number, catClassId: number) => api.delete(`/categories/${skillId}/categories/${catClassId}`),
};

// API для аутентификации
export const authApi = {
  login: (login: string, password: string) => api.post("/auth/login", { login, password }),
  register: (login: string, password: string) => api.post("/auth/register", { login, password }),
  getBalance: (userId: number) => api.get(`/users/${userId}/balance`),
  topUp: (userId: number, amount: number) => api.post(`/users/${userId}/balance/topup`, { amount }),
  withdraw: (userId: number, amount: number) => api.post(`/users/${userId}/balance/withdraw`, { amount }),
  getTransactions: (userId: number) => api.get(`/users/${userId}/transactions`),
};
