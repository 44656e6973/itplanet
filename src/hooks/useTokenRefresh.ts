import { useEffect, useEffectEvent } from 'react';
import { useAuthStore } from '@/stores/authStore';

const TOKEN_REFRESH_INTERVAL_MS = 60 * 60 * 1000;

export const useTokenRefresh = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const tokenRefreshedAt = useAuthStore((state) => state.tokenRefreshedAt);
  const refreshTokens = useAuthStore((state) => state.refreshTokens);

  const scheduleRefresh = useEffectEvent(async () => {
    await refreshTokens();
  });

  useEffect(() => {
    if (!isAuthenticated || !refreshToken) {
      return;
    }

    const baseTime = tokenRefreshedAt ?? Date.now();
    const nextRefreshDelay = Math.max(
      0,
      baseTime + TOKEN_REFRESH_INTERVAL_MS - Date.now()
    );

    const timeoutId = window.setTimeout(() => {
      void scheduleRefresh();
    }, nextRefreshDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isAuthenticated, refreshToken, tokenRefreshedAt]);
};
