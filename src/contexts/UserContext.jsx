import React, { createContext, useContext, useState, useCallback } from "react";
import {
  apiPost,
  setToken,
  setStoredUser,
  getStoredUser,
} from "../lib/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  // Restore any previously logged-in user so a refresh keeps the session.
  const [user, setUser] = useState(() => getStoredUser());
  // Bumped after an upload/new comment so views know to refetch.
  const [refreshKey, setRefreshKey] = useState(0);

  const login = useCallback(async (login_name, password) => {
    const data = await apiPost("/admin/login", { login_name, password });
    setToken(data.token);
    const loggedIn = {
      _id: data._id,
      first_name: data.first_name,
      last_name: data.last_name,
      login_name: data.login_name,
    };
    setStoredUser(loggedIn);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiPost("/admin/logout", {});
    } catch (e) {
      // Even if the server call fails, clear the client side.
    }
    setToken(null);
    setStoredUser(null);
    setUser(null);
  }, []);

  // Registration does NOT log the user in (per the assignment).
  const register = useCallback((fields) => apiPost("/user", fields), []);

  const bumpRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const value = { user, login, logout, register, refreshKey, bumpRefresh };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
