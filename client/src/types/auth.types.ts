export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  city?: string;
  avatarUrl?: string;
  createdAt: string;
}

// things that the context provides to components
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  data: User;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: User;
}
