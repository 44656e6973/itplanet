import { create } from 'zustand';
import type { RegistrationSubmitData } from '@/components/auth/types';

const API_URL = import.meta.env.VITE_API_URL;
const COMPANIES_API_URL = `${API_URL}/companies`;

interface ApiErrorDetail {
  loc?: Array<string | number>;
  msg?: string;
}

interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
    details?: ApiErrorDetail[];
  };
}

const formatValidationError = (details: ApiErrorDetail[] = []) => {
  const messages = details
    .map((detail) => {
      const field = detail.loc?.[detail.loc.length - 1];
      if (!field || !detail.msg) {
        return null;
      }

      return `${String(field)}: ${detail.msg}`;
    })
    .filter(Boolean);

  if (messages.length === 0) {
    return 'Проверьте корректность введённых данных.';
  }

  return messages.join(', ');
};

const getApiErrorMessage = async (response: Response) => {
  const errorData = await response.json().catch(() => ({} as ApiErrorResponse));
  const apiError = errorData.error;

  if (response.status === 422) {
    return formatValidationError(apiError?.details);
  }

  if (response.status === 409) {
    return apiError?.message || 'Пользователь с такими данными уже существует.';
  }

  return apiError?.message || `Ошибка ${response.status}`;
};

const getInnVerificationErrorMessage = async (response: Response) => {
  if (response.status === 404) {
    return 'ИНН не найден.';
  }

  if (response.status === 422) {
    return 'Компания ликвидирована или находится в процедуре банкротства.';
  }

  if (response.status === 502) {
    return 'Сервис проверки ИНН недоступен.';
  }

  return getApiErrorMessage(response);
};

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

  login: (username: string, password: string) => Promise<boolean>;
  register: (data: RegistrationSubmitData) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const body = new URLSearchParams({
        username,
        password,
      });

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response));
      }

      const data = await response.json();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Ошибка входа',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (data: RegistrationSubmitData) => {
    set({ isLoading: true, error: null });

    try {
      if (data.role === 'employer') {
        const verifyInnResponse = await fetch(`${COMPANIES_API_URL}/verify-inn`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inn: data.inn }),
        });

        if (!verifyInnResponse.ok) {
          throw new Error(await getInnVerificationErrorMessage(verifyInnResponse));
        }
      }

      const payload = {
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword,
        role: data.role,
        first_name: data.firstName,
        last_name: data.lastName,
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await getApiErrorMessage(response));
      }

      const result = await response.json();
      set({ user: result.user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Ошибка регистрации',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
