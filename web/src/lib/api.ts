import axios from "axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  MedicinesResponse,
  MedicineResponse,
  CreateMedicineRequest,
  UpdateMedicineRequest,
  User,
} from "../types";

const API_BASE_URL = "http://localhost:3000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error Details:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    });

    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      console.error(
        "🚨 Backend server is not running on http://localhost:3000"
      );
      console.error("Please start the backend server first");
      alert(
        "Backend server is not running. Please check the console and start the API server."
      );
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  me: async (): Promise<{ success: boolean; data: { user: User } }> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Medicines API
export const medicinesApi = {
  getAll: async (): Promise<MedicinesResponse> => {
    console.log("Fetching all medicines...");
    const response = await api.get("/medicines");
    console.log("Medicines API response:", response.data);
    return response.data;
  },

  getById: async (id: number): Promise<MedicineResponse> => {
    console.log("Fetching medicine with ID:", id);
    const response = await api.get(`/medicines/${id}`);
    console.log("Medicine API response:", response.data);
    return response.data;
  },

  create: async (data: CreateMedicineRequest): Promise<MedicineResponse> => {
    console.log("Creating medicine:", data);
    const response = await api.post("/medicines", data);
    console.log("Create medicine response:", response.data);
    return response.data;
  },

  update: async (
    id: number,
    data: UpdateMedicineRequest
  ): Promise<MedicineResponse> => {
    const response = await api.put(`/medicines/${id}`, data);
    return response.data;
  },

  delete: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/medicines/${id}`);
    return response.data;
  },
};

export default api;
