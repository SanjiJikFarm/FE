// auth.js
import { axiosInstance } from './axios';
import { withErrorBoundary } from './axios';
import { useAuthStore } from './store';

// 회원가입
export const register = (username, email, password) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.post('/auth/register', { username, email, password });
    return res.data;
  });

// 로그인
export const login = (username, password) =>
  withErrorBoundary(async () => {
    const res = await axiosInstance.post('/auth/login', { username, password });
    const data = res.data;

    if (data.success && data.token && data.refreshToken) {
      useAuthStore.getState().setTokens(data.token, data.refreshToken);
    }
    return data;
  });

// 토큰 재발급
export const reissue = () =>
  withErrorBoundary(async () => {
    const { refreshToken } = useAuthStore.getState();
    if (!refreshToken) return null;

    const res = await axiosInstance.post('/auth/refresh', { refreshToken });
    const data = res.data;

    if (data.success && data.token && data.refreshToken) {
      useAuthStore.getState().setTokens(data.token, data.refreshToken);
      return data.token;
    }
    return null;
  });

// 로그아웃
export const logout = () =>
  withErrorBoundary(async () => {
    const { refreshToken } = useAuthStore.getState();
    try {
      await axiosInstance.post('/auth/logout', { refreshToken });
    } finally {
      useAuthStore.getState().clear();
    }
  });
