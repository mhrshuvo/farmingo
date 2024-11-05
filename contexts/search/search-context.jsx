"use client";

import React, { createContext, useContext, useState } from "react";

// Create the context
const SearchContext = createContext();

// Provide the context
export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use the search context
export const useSearch = () => useContext(SearchContext);
