import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  accessToken: null,
  refreshToken: null,
  username: null,
  profileImageKey: null,

  setTokens: (access, refresh) => set({ accessToken: access, refreshToken: refresh }),

  setUsername: (name) => set({ username: name }),

  setProfileImageKey: (key) =>
    set((state) => {
      if (state.profileImageKey === key) return state;
      return { profileImageKey: key };
    }),

  clear: () => set({ accessToken: null, refreshToken: null, username: null, profileImageKey: null }),
}));
