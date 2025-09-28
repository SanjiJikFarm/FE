import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,

  setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
  clear: () => set({ accessToken: null, refreshToken: null }),
}));
