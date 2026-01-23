import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../stores/auth.store";
import { queryClient } from "../lib/queryClient";

/**
 * Hook for user login
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.tokens.access.token);
      setAuth(data.user);
      queryClient.setQueryData(["user"], data.user);
      navigate("/");
    },
  });
};

/**
 * Hook for user registration
 */
export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.tokens.access.token);
      setAuth(data.user);
      queryClient.setQueryData(["user"], data.user);
      navigate("/");
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      clearAuth();
      queryClient.removeQueries(["user"]);
      navigate("/login");
    },
    onError: () => {
      // Even if the API call fails, clear local state
      localStorage.removeItem("accessToken");
      clearAuth();
      queryClient.removeQueries(["user"]);
      navigate("/login");
    },
  });
};

/**
 * Hook to get current user data
 */
export const useUser = (options = {}) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authService.getMe,
    ...options,
  });
};

/**
 * Hook for forgot password
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

/**
 * Hook for reset password
 */
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, password }) =>
      authService.resetPassword(token, password),
    onSuccess: () => {
      navigate("/login");
    },
  });
};

/**
 * Hook for sending verification email
 */
export const useSendVerificationEmail = () => {
  return useMutation({
    mutationFn: authService.sendVerificationEmail,
  });
};

/**
 * Hook for verifying email
 */
export const useVerifyEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: () => {
      navigate("/");
    },
  });
};
