// axios.js
import axios from 'axios';

import { logout, reissue } from './auth';
import { useAuthStore } from './store';
import { toHttpError } from './utils';

export const axiosInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 요청 인터셉터: accessToken 붙이기
axiosInstance.interceptors.request.use((config) => {
  const isAuthRequest = config.url?.includes('api/v1/auth/social/login') || config.url?.includes('api/v1/auth/refresh');

  if (!isAuthRequest) {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

// 응답 인터셉터: accessToken 만료 → refresh → 재요청
axiosInstance.interceptors.response.use(
  // 응답 header에 token 있으면 바로 갱신
  (response) => {
    const authHeader = response.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const newToken = authHeader.split(' ')[1];
      useAuthStore.getState().setAccessToken(newToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await reissue();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }

      await logout();
    }
    // 공통 Error Format으로 변환
    throw toHttpError(error);
  },
);
