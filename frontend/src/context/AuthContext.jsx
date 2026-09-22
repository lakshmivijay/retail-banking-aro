import { createContext, useContext, useMemo, useState } from "react";
import { login as loginRequest } from "../api/auth";

const AUTH_STORAGE_KEY = "banking-auth";

const AuthContext = createContext(null);

function readStoredAuth() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredAuth);

  const login = (username, password) =>
    loginRequest(username, password).then((data) => {
      const authState = {
        token: data.token,
        username: data.username,
        role: data.role,
        customerId: data.customerId,
        name: data.name,
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
      setUser(authState);
      return authState;
    });

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isStaff: user?.role === "STAFF",
      isCustomer: user?.role === "CUSTOMER",
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
