import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,

      setAuth: (user) =>
        set({
          user,
          isAuthenticated: true,
          isInitialized: true,
        }),

      setInitialized: () =>
        set({
          isInitialized: true,
        }),

      logout: () => {
        localStorage.removeItem("accessToken");
        set({ user: null, isAuthenticated: false });
      },

      clearAuth: () => {
        localStorage.removeItem("accessToken");
        set({ user: null, isAuthenticated: false, isInitialized: true });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
