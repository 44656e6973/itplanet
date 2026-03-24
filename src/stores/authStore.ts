import { create } from 'zustand';
import type { RegistrationData } from '@/components/auth/types';

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

  login: async (email: string, _password: string) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Заменить на реальный API вызов
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Имитация успешного входа
      const user: User = {
        id: '1',
        email,
        role: 'employer',
      };

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Ошибка входа',
        isLoading: false
      });
    }
  },

  register: async (data: RegistrationData) => {
    set({ isLoading: true, error: null });

    try {
      // TODO: Заменить на реальный API вызов
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Имитация успешной регистрации
      const user: User = {
        id: '1',
        email: data.email,
        role: data.role,
      };

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Ошибка регистрации',
        isLoading: false
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
