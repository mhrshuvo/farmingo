"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...state, { ...action.payload, quantity: 1 }];
      }
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload.id);
    case "DECREASE_QUANTITY":
      return state
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], (initial) => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : initial;
  });

  useEffect(() => {
    // Local storage update should only occur when cart state changes
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]); // Ensure the effect depends on cart state

  // Define cart context functions
  const addItemToCart = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItemFromCart = (itemId) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const decreaseQuantity = (itemId) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const setCart = (newCart) => {
    dispatch({ type: "SET_CART", payload: newCart });
  };

  // Provide cart context values
  const contextValues = {
    cart,
    addItemToCart,
    removeItemFromCart,
    decreaseQuantity,
    clearCart,
    setCart,
  };

  return (
    <CartContext.Provider value={contextValues}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
