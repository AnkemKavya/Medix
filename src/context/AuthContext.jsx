import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData, setData, removeData, STORAGE_KEYS } from '../services/storageService';

const AuthContext = createContext(null);

export const DEFAULT_USER = {
  id: "USR-001",
  name: "Dr. Deepak Sharma",
  role: "Hospital Administrator",
  designation: "Chief Medical Admin",
  email: "admin@medixhms.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  lastLogin: new Date().toISOString()
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return getData(STORAGE_KEYS.USER_SESSION, DEFAULT_USER);
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!getData(STORAGE_KEYS.USER_SESSION, DEFAULT_USER);
  });

  const login = (email, password, rememberMe = true) => {
    // Validating demo credentials
    if (email.trim().toLowerCase() === "admin@medixhms.com" && password === "password123") {
      const user = {
        ...DEFAULT_USER,
        email: email.trim(),
        lastLogin: new Date().toISOString()
      };
      setCurrentUser(user);
      setIsAuthenticated(true);
      if (rememberMe) {
        setData(STORAGE_KEYS.USER_SESSION, user);
      }
      return { success: true };
    } else {
      return {
        success: false,
        message: "Invalid credentials. Use admin@medixhms.com / password123"
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    removeData(STORAGE_KEYS.USER_SESSION);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
