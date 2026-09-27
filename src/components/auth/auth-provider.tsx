"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { apiRequest, resetCsrfState } from "@/lib/api-client";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: "user" | "admin" | string;
  created_at: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await apiRequest<{ user: AuthUser }>("/api/v1/auth/me");
      setUser(response.data.user);
      return response.data.user;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const refreshTimer = window.setTimeout(() => void refreshUser(), 0);
    const clearSession = () => setUser(null);
    window.addEventListener("daccord:session-expired", clearSession);
    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("daccord:session-expired", clearSession);
    };
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/api/v1/auth/logout", { method: "POST" });
    } finally {
      resetCsrfState();
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, loading, refreshUser, logout }), [user, loading, refreshUser, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa ser usado dentro de AuthProvider.");
  return context;
}
