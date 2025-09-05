export interface AuthRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
  };
  token: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}

export interface MedicineSearchQuery {
  search?: string;
  category?: string;
  location?: string;
  sortBy?: "name" | "location" | "createdAt" | "expiryDate";
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface AISearchRequest {
  query: string;
  userId: number;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
