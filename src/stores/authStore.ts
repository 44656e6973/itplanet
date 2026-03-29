import { create } from 'zustand';
import type { User as ApiUser, UserRole } from '@/types/api';
import { authApi, usersApi } from '@/api/apiClient';
import type { RegistrationSubmitData } from '@/components/auth/types';

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

export interface User extends ApiUser {
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<boolean>;
  register: (data: RegistrationSubmitData) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>;
}

// Token management
const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  fetchCurrentUser: async () => {
    const token = getAccessToken();
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    try {
      const userData = await usersApi.me() as User;
      set({ user: userData, isAuthenticated: true });
    } catch {
      clearTokens();
      set({ user: null, isAuthenticated: false });
    }
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const data = await authApi.login(username, password) as { user: User; access_token: string; refresh_token: string };
      setTokens(data.access_token, data.refresh_token);
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
      const API_URL = import.meta.env.VITE_API_URL;
      
      if (data.role === 'employer') {
        const verifyInnResponse = await fetch(`${API_URL}/companies/verify-inn`, {
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
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
      };

      const result = await authApi.register(payload) as { user: User; access_token: string; refresh_token: string };
      setTokens(result.access_token, result.refresh_token);
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

  logout: async () => {
    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      
      if (accessToken && refreshToken) {
        await authApi.logout();
      }
    } catch {
      // Ignore logout errors
    } finally {
      clearTokens();
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Initialize auth state on mount
export const initializeAuth = () => {
  const { fetchCurrentUser } = useAuthStore.getState();
  fetchCurrentUser();
};

// Role-based utilities
export const isUserCurator = () => {
  const { user } = useAuthStore.getState();
  return user?.role === 'curator';
};

export const isUserEmployer = () => {
  const { user } = useAuthStore.getState();
  return user?.role === 'employer';
};

export const isUserApplicant = () => {
  const { user } = useAuthStore.getState();
  return user?.role === 'applicant';
};
