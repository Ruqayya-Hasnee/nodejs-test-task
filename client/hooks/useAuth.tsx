"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getDecodedToken, removeToken } from "@/services/tokenService";

type Role = "user" | "admin" | null;

type AuthContextValue = {
  role: Role;
  checked: boolean;
  refresh: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(null);
  const [checked, setChecked] = useState(false);

  const refresh = () => {
    const decoded = getDecodedToken();
    setRole(decoded?.role ?? null);
    setChecked(true);
  };

  useEffect(() => {
    const syncFromStorage = () => {
      const decoded = getDecodedToken();
      setRole(decoded?.role ?? null);
      setChecked(true);
    };
    syncFromStorage();
  }, []);

  const logout = () => {
    removeToken();
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, checked, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
