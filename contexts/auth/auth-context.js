"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (token) => {
    Cookies.set("authToken", token, { expires: 30 });
    setIsAuthenticated(true);
  };

  const signUp = (token) => {
    Cookies.set("authToken", token, { expires: 30 });
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("authToken");
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ isAuthenticated, login, logout, signUp }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};
