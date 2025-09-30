import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  username: null,

  setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),
  setUsername: (name) => set({ username: name }),
  clear: () => set({ accessToken: null, refreshToken: null }),
}));
