"use client";

import { ROUTES } from "@/routes/routes";
import { getAuthToken } from "@/utils/getAuthToken";
import Cookies from "js-cookie";
import React, { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";

// Create AuthContext
const AuthContext = createContext();

// Create AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(getAuthToken());
  const [user, setUser] = useState(null);

  useEffect(() => {
    // When authToken is set or removed, synchronize the user state
    if (authToken) {
      setUser(Cookies.get("UserName"));
    } else {
      setUser(null); // Reset user if authToken is null
    }
  }, [authToken]); // Trigger the effect whenever authToken changes

  const login = (token, userName) => {
    setAuthToken(token);
    Cookies.set("authToken", token);
    Cookies.set("UserName", userName); // Set user name in cookie
    setUser(userName); // Set the user state
  };

  const logout = async () => {
    try {
      // Make a request to the logout API endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.LOG_OUT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Include the auth token if required
          },
        }
      );

      if (response.ok) {
        setAuthToken(null);
        Cookies.remove("authToken");
        Cookies.remove("UserName");
        setUser(null); // Reset user state
        toast.success("User logged out");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const isAuthenticated = () => {
    return authToken !== null;
  };

  return (
    <AuthContext.Provider
      value={{ authToken, login, logout, isAuthenticated, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
