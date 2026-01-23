import api from "../lib/api";

export const authService = {
  register: async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  refreshTokens: async () => {
    const response = await api.post("/auth/refresh-tokens");
    return response.data;
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password?token=${token}`, {
      password,
    });
    return response.data;
  },

  sendVerificationEmail: async () => {
    const response = await api.post("/auth/send-verification-email");
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.post(`/auth/verify-email?token=${token}`);
    return response.data;
  },
};
