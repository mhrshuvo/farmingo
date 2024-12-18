"use client";

import useLocalStorage from "@/hooks/useLocalStorage";
import React, { createContext, useContext } from "react";

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
      return state.filter((item) => item.id !== action.payload);

    case "DECREASE_QUANTITY": {
      return state.reduce((result, item) => {
        if (item.id === action.payload.id) {
          if (item.quantity > 1) {
            return [...result, { ...item, quantity: item.quantity - 1 }];
          }
          // Automatically remove item if quantity reaches 0
          return result;
        }
        return [...result, item];
      }, []);
    }

    case "CLEAR_CART":
      return [];

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useLocalStorage("cart", []);

  const dispatch = (action) => {
    setCart((prevCart) => cartReducer(prevCart, action));
  };

  // Cart functions
  const addItemToCart = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItemFromCart = (itemId) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  };

  const decreaseQuantity = (itemId) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: { id: itemId } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  // New function to get item quantity
  const getItemQuantity = (itemId) => {
    const item = cart.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const contextValues = {
    cart,
    addItemToCart,
    removeItemFromCart,
    decreaseQuantity,
    clearCart,
    getItemQuantity,
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
