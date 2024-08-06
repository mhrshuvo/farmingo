"use client";

import { ROUTES } from "@/routes/routes";
import { getAuthToken } from "@/utils/getAuthToken";
import Cookies from "js-cookie";
import React, { createContext, useState, useContext } from "react";
import toast from "react-hot-toast";

// Create AuthContext
const AuthContext = createContext();

// Create AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(getAuthToken());
  const [user, setUser] = useState(Cookies.get("UserName"));

  const login = (token) => {
    setAuthToken(token);
    Cookies.set("authToken", token);
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
        toast.success("User logged out");
        Cookies.remove("authToken");
        setUser(null); // Reset user state
      } else {
        // Handle error response
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
      value={{ authToken, login, logout, isAuthenticated, setUser, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
