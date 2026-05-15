import api from "./axios";
import type { LoginResponse, RegisterResponse } from "../types/auth.types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  bio?: string;
  city?: string;
}

export const loginApi = async (
  credentials: LoginCredentials,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/users/login", credentials);
  return response.data;
};

export const registerApi = async (
  credentials: RegisterCredentials,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>(
    "/users/register",
    credentials,
  );
  return response.data;
};
