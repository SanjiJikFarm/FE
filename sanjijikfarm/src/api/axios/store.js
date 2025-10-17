import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      username: null,
      profileImageKey: null,

      // 토큰 저장
      setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
      // 사용자 아이디 저장
      setUsername: (name) => set({ username: name }),
      // 프로필 이미지 키 저장
      setProfileImageKey: (key) => set({ profileImageKey: key }),

      // 로그아웃시 상태 초기화
      clear: () => set({ accessToken: null, refreshToken: null, username: null, profileImageKey: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
