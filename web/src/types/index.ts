export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medicine {
  id: number;
  userId: number;
  name: string;
  description?: string;
  location: string;
  category: string;
  expiryDate?: string;
  quantity: number;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface CreateMedicineRequest {
  name: string;
  description?: string;
  location: string;
  category: string;
  expiryDate?: string;
  quantity: number;
  notes?: string;
  imageUrl?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateMedicineRequest extends Partial<CreateMedicineRequest> {}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface MedicinesResponse {
  success: boolean;
  data: Medicine[];
  message?: string;
}

export interface MedicineResponse {
  success: boolean;
  data: {
    medicine: Medicine;
  };
  message: string;
}
