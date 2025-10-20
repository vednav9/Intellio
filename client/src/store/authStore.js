import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/authApi";
import { tokenManager } from "../utils/tokenManager";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(userData);
          const { user, accessToken, refreshToken } = response.data;

          tokenManager.setTokens(accessToken, refreshToken);
          set({ user, isAuthenticated: true, isLoading: false });

          toast.success("Registration successful!");
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message =
            error.response?.data?.message || "Registration failed";
          toast.error(message);
          return { success: false, message };
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(credentials);
          const { user, accessToken, refreshToken } = response.data;

          tokenManager.setTokens(accessToken, refreshToken);
          set({ user, isAuthenticated: true, isLoading: false });

          toast.success("Login successful!");
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || "Login failed";
          toast.error(message);
          return { success: false, message };
        }
      },

      logout: async () => {
        try {
          const refreshToken = tokenManager.getRefreshToken();
          if (refreshToken) {
            await authApi.logout(refreshToken);
          }

          tokenManager.clearTokens();
          set({ user: null, isAuthenticated: false });
          toast.success("Logged out successfully");
        } catch (error) {
          console.error("Logout error:", error);
          tokenManager.clearTokens();
          set({ user: null, isAuthenticated: false });
        }
      },

      logoutAll: async () => {
        try {
          await authApi.logoutAll();
          tokenManager.clearTokens();
          set({ user: null, isAuthenticated: false });
          toast.success("Logged out from all devices");
        } catch (error) {
          console.error("Logout all error:", error);
        }
      },

      loadUser: async () => {
        const accessToken = tokenManager.getAccessToken();

        if (!accessToken || tokenManager.isTokenExpired(accessToken)) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        try {
          const response = await authApi.getMe();
          set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
          console.error("Load user error:", error);
          tokenManager.clearTokens();
          set({ user: null, isAuthenticated: false });
        }
      },

      handleOAuthCallback: (accessToken, refreshToken) => {
        tokenManager.setTokens(accessToken, refreshToken);
        get().loadUser();
        toast.success("Login successful!");
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
