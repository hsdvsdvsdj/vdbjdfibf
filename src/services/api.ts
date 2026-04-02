// src/services/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiError {
  detail: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token");
    }
  }

  // Публичный метод для переинициализации токена перед использованием
  public reloadToken() {
    this.loadToken();
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem("access_token", token);
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem("access_token");
  }

  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = (await response.json()) as ApiError;
      throw new Error(error.detail || "API error");
    }
    return response.json() as Promise<T>;
  }

  // Auth endpoints
  async register(data: {
    login: string;
    password: string;
  }): Promise<{ access_token: string; token_type: string }> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });

    const result = await this.handleResponse<{ access_token: string; token_type: string }>(response);
    this.setToken(result.access_token);
    return result;
  }

  async login(login: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(false),
      credentials: "include",
      body: JSON.stringify({ login, password }),
    });

    const result = await this.handleResponse<{ access_token: string; token_type: string }>(response);
    this.setToken(result.access_token);
    return result;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: "POST",
        headers: this.getHeaders(true),
        credentials: "include",
      });
    } finally {
      this.clearToken();
    }
  }

  async refreshToken(): Promise<{ access_token: string; token_type: string }> {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: this.getHeaders(false),
      credentials: "include",
    });

    const result = await this.handleResponse<{ access_token: string; token_type: string }>(response);
    this.setToken(result.access_token);
    return result;
  }

  // User endpoints
  async getCurrentUser(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/users/me`, {
      method: "GET",
      headers: this.getHeaders(true),
      credentials: "include",
    });

    return this.handleResponse(response);
  }

  async getUserProfile(userId: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: "GET",
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async updateUserProfile(data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/users/me`, {
      method: "PUT",
      headers: this.getHeaders(true),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  // Skills endpoints
  async createSkill(data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/skills`, {
      method: "POST",
      headers: this.getHeaders(true),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async getSkills(params?: {
    category?: string;
    experience_level?: string;
    search?: string;
    skip?: number;
    limit?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(`${this.baseUrl}/skills?${queryParams.toString()}`, {
      method: "GET",
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async getSkillById(skillId: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/skills/${skillId}`, {
      method: "GET",
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  async updateSkill(skillId: number, data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/skills/${skillId}`, {
      method: "PUT",
      headers: this.getHeaders(true),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async deleteSkill(skillId: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/skills/${skillId}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
      credentials: "include",
    });

    return this.handleResponse(response);
  }

  // Orders endpoints
  async createOrder(data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: "POST",
      headers: this.getHeaders(true),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async getOrders(params?: { status?: string; role?: string; skip?: number; limit?: number }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(`${this.baseUrl}/orders?${queryParams.toString()}`, {
      method: "GET",
      headers: this.getHeaders(true),
      credentials: "include",
    });

    return this.handleResponse(response);
  }

  async getOrderById(orderId: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: "GET",
      headers: this.getHeaders(true),
      credentials: "include",
    });

    return this.handleResponse(response);
  }

  async updateOrderStatus(orderId: number, status: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
      method: "PUT",
      headers: this.getHeaders(true),
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    return this.handleResponse(response);
  }

  // Reviews endpoints
  async createReview(data: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/reviews`, {
      method: "POST",
      headers: this.getHeaders(true),
      credentials: "include",
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  async getSkillReviews(skillId: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/skills/${skillId}/reviews`, {
      method: "GET",
      headers: this.getHeaders(false),
    });

    return this.handleResponse(response);
  }

  // Chat endpoints
  async getOrderChats(orderId: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/chats/order/${orderId}`, {
      method: "GET",
      headers: this.getHeaders(true),
      credentials: "include",
    });

    return this.handleResponse(response);
  }

  async sendMessage(orderId: number, message: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/chats/order/${orderId}/message`, {
      method: "POST",
      headers: this.getHeaders(true),
      credentials: "include",
      body: JSON.stringify({ message }),
    });

    return this.handleResponse(response);
  }
}

export const api = new ApiClient(API_BASE_URL);
