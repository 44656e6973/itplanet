import { create } from 'zustand';
import type { RegistrationData } from '@/components/auth/types';

// URL бэкенда API (замените на ваш)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface User {
  id: string;
  email: string;
  role: 'employer' | 'applicant';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegistrationData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}`);
      }

      const data = await response.json();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Ошибка входа',
        isLoading: false,
      });
    }
  },

  register: async (data: RegistrationData) => {
    set({ isLoading: true, error: null });

    try {
      // Преобразуем данные в формат бэкенда
      const payload = data.role === 'applicant'
        ? {
            email: data.email,
            password: data.password,
            role: data.role,
            first_name: (data as any).firstName || '',
            last_name: (data as any).lastName || '',
          }
        : {
            email: data.email,
            password: data.password,
            role: data.role,
            company_name: (data as any).companyName || '',
            inn: (data as any).inn || '',
            phone: data.phone,
          };

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка ${response.status}`);
      }

      const result = await response.json();
      set({ user: result.user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Ошибка регистрации',
        isLoading: false,
      });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
