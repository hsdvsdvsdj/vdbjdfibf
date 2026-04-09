import useSWR, { SWRConfiguration } from "swr";
import { authApi, skillsApi, ordersApi, reviewsApi, chatsApi, messagesApi, usersApi, categoriesApi } from "./apiEndpoints";

// Hook для получения всех навыков
export const useSkills = (config?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    "skills",
    () => skillsApi.getAll(),
    config
  );
  return { skills: data?.data || [], error, isLoading, mutate };
};

// Hook для получения одного навыка
export const useSkill = (id: string | number | null, config?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `skill-${id}` : null,
    () => id ? skillsApi.getById(id) : null,
    config
  );
  return { skill: data?.data, error, isLoading, mutate };
};

// Hook для получения навыков по категории
export const useSkillsByCategory = (category: string | null, config?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    category ? `skills-${category}` : null,
    () => category ? skillsApi.getByCategory(category) : null,
    config
  );
  return { skills: data?.data || [], error, isLoading, mutate };
};

// Hook для получения заказов пользователя
export const useUserOrders = (userId: number | null, config?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `orders-${userId}` : null,
    () => userId ? ordersApi.getByUser(userId) : null,
    config
  );
  return { orders: data?.data || [], error, isLoading, mutate };
};

// Hook для получения отзывов навыка
export const useSkillReviews = (skillId: string | number | null, config?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    skillId ? `reviews-skill-${skillId}` : null,
    () => skillId ? reviewsApi.getBySkill(skillId) : null,
    config
  );
  return { reviews: data?.data || [], error, isLoading, mutate };
};

// Hook для получения отзывов пользователя
export const useUserReviews = (userId: number | null, config?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `reviews-user-${userId}` : null,
    () => userId ? reviewsApi.getByUser(userId) : null,
    config
  );
  return { reviews: data?.data || [], error, isLoading, mutate };
};

// Hook для получения чатов пользователя
export const useUserChats = (userId: number | null, config?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `chats-${userId}` : null,
    () => userId ? chatsApi.getUserChats(userId) : null,
    config
  );
  return { chats: data?.data || [], error, isLoading, mutate };
};

// Hook для получения сообщений чата
export const useChatMessages = (chatId: number | null, config?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    chatId ? `messages-${chatId}` : null,
    () => chatId ? messagesApi.getChatMessages(chatId) : null,
    { ...config, refreshInterval: 2000 } // Обновляем каждые 2 секунды
  );
  return { messages: data?.data || [], error, isLoading, mutate };
};

// Hook для получения баланса пользователя
export const useBalance = (userId: number | null, config?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `balance-${userId}` : null,
    () => userId ? authApi.getBalance(userId) : null,
    config
  );
  return { balance: data?.data?.balance, error, isLoading, mutate };
};

// Hook для получения транзакций пользователя
export const useTransactions = (userId: number | null, config?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `transactions-${userId}` : null,
    () => userId ? authApi.getTransactions(userId) : null,
    config
  );
  return { transactions: data?.data || [], error, isLoading, mutate };
};

// Hook для получения всех категорий
export const useCategories = (config?: SWRConfiguration) => {
  const { data, error, isLoading, mutate } = useSWR(
    "categories",
    () => categoriesApi.getAll(),
    config
  );
  return { categories: data?.data || [], error, isLoading, mutate };
};
