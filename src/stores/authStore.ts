import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User as ApiUser, UserRole } from '@/types/api';
import { authApi, usersApi } from '@/api/apiClient';
import type { RegistrationSubmitData } from '@/components/auth/types';

const AUTH_STORAGE_KEY = 'auth-storage';

// === Types ===
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

// === Error helpers ===
const formatValidationError = (details: ApiErrorDetail[] = []) => {
  const messages = details
    .map((detail) => {
      const field = detail.loc?.[detail.loc.length - 1];
      if (!field || !detail.msg) return null;
      return `${String(field)}: ${detail.msg}`;
    })
    .filter(Boolean);

  return messages.length === 0 
    ? 'Проверьте корректность введённых данных.' 
    : messages.join(', ');
};

const getApiErrorMessage = async (response: Response) => {
  const errorData = await response.json().catch(() => ({} as ApiErrorResponse));
  const apiError = errorData.error;

  if (response.status === 422) return formatValidationError(apiError?.details);
  if (response.status === 409) return apiError?.message || 'Пользователь с такими данными уже существует.';
  return apiError?.message || `Ошибка ${response.status}`;
};

const getInnVerificationErrorMessage = async (response: Response) => {
  if (response.status === 404) return 'ИНН не найден.';
  if (response.status === 422) return 'Компания ликвидирована или находится в процедуре банкротства.';
  if (response.status === 502) return 'Сервис проверки ИНН недоступен.';
  return getApiErrorMessage(response);
};

// === User & State ===
export interface User extends ApiUser {
  role: UserRole;
}

interface AuthResponse {
  user?: User;
  access_token?: string;
  refresh_token?: string;
}

const getAuthData = (response: AuthResponse, fallbackUser: User | null = null) => ({
  user: response.user ?? fallbackUser,
  accessToken: response.access_token ?? null,
  refreshToken: response.refresh_token ?? null,
  tokenRefreshedAt: Date.now(),
  isAuthenticated: true,
  isLoading: false,
  error: null,
});

const getLoggedOutState = () => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  tokenRefreshedAt: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenRefreshedAt: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<boolean>;
  register: (data: RegistrationSubmitData) => Promise<boolean>;
  refreshTokens: () => Promise<boolean>;
  logout: () => Promise<void>; // ← async, как ты хотел
  clearError: () => void;
  fetchCurrentUser: () => Promise<void>;
}

// === Store ===
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...getLoggedOutState(),

      fetchCurrentUser: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ user: null, isAuthenticated: false });
          return;
        }
        try {
          const userData = await usersApi.me() as User;
          set({ user: userData, isAuthenticated: true });
        } catch {
          set(getLoggedOutState());
        }
      },

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.login(username, password) as AuthResponse;
          set(getAuthData(data));
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
            const verifyInnResponse = await fetch(`${import.meta.env.VITE_API_URL}/companies/verify-inn`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
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

          const result = await authApi.register(payload) as AuthResponse;
          set(getAuthData(result));
          return true;
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : 'Ошибка регистрации',
            isLoading: false,
          });
          return false;
        }
      },

      refreshTokens: async () => {
        const { refreshToken, user } = get();
        if (!refreshToken) {
          set(getLoggedOutState());
          return false;
        }
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          if (!response.ok) throw new Error(await getApiErrorMessage(response));
          const data = (await response.json()) as AuthResponse;
          set(getAuthData(data, user));
          return true;
        } catch {
          set(getLoggedOutState());
          return false;
        }
      },

      logout: async () => {
        const { accessToken, refreshToken } = get();
        try {
          // 🔥 Ключевое: вызов твоего эндпоинта
          if (accessToken && refreshToken) {
            await authApi.logout(); // POST /api/users/logout
          }
        } catch (err) {
          console.warn('[Auth] Logout API error:', err);
          // Не блокируем выход, даже если бэкенд не ответил
        } finally {
          set(getLoggedOutState());
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenRefreshedAt: state.tokenRefreshedAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// === Helpers ===
export const getAccessToken = () => useAuthStore.getState().accessToken;
export const getRefreshToken = () => useAuthStore.getState().refreshToken;

export const initializeAuth = () => {
  const { fetchCurrentUser } = useAuthStore.getState();
  fetchCurrentUser();
};

export const isUserCurator = () => useAuthStore.getState().user?.role === 'curator';
export const isUserEmployer = () => useAuthStore.getState().user?.role === 'employer';
export const isUserApplicant = () => useAuthStore.getState().user?.role === 'applicant';