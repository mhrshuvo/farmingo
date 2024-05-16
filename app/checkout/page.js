"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/cart/cart-context";
import { ROUTES } from "@/routes/routes";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth/auth-context";
import { useAuthModal } from "@/contexts/auth/login-modal";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useAuthModal();
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  const handleOrder = async () => {
    // If user isn't logged in, show the login modal
    if (!isAuthenticated()) {
      openLoginModal();
      return;
    }

    // Fetch zone data
    const zoneResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.ZONES}`
    );
    if (!zoneResponse.ok) {
      throw new Error("Failed to fetch zones");
    }
    const zonesData = await zoneResponse.json();

    // Find the selected zone
    const selectedZone = localStorage.getItem("selectedZone");
    const zone = zonesData.find((zone) => zone.name === selectedZone);

    if (!zone) {
      throw new Error("Selected zone not found in zones data");
    }

    // Construct product array from cart items
    const productData = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    // Combine zone_id with product data
    const orderData = {
      zone_id: zone.id,
      product: productData,
    };

    // Send POST request
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`, // Include the auth token if required
      },
      body: JSON.stringify(orderData),
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.ORDER}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Failed to send order data");
      }
      toast.success("Order placed successfully");

      clearCart();
    } catch (error) {
      console.error("Error sending order data:", error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-sm h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Checkout Items</h2>
      {/* Render cart items */}
      {cart.length === 0 ? (
        <p className="text-gray-800">Your cart is empty.</p>
      ) : (
        <div>
          <ul className="divide-y divide-gray-200 shadow-md rounded-md">
            {cart.map((item) => (
              <li
                key={item.id}
                className="py-4 px-2 flex items-center justify-between border-b border-gray-300"
              >
                {/* Left column: Image and name */}
                <div
                  className="flex items-center border-r border-gray-300 pr-2"
                  style={{ flex: "2", minWidth: "100px" }}
                >
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMG_URL}${item.image}`}
                    alt={item.name}
                    className="w-12 h-12 mr-4 rounded-md"
                  />
                  <p className="text-gray-800">{item.name}</p>
                </div>

                {/* Middle column: Price (Only visible on larger screens) */}
                <div
                  className="hidden md:flex items-center w-12 h-12 justify-center border-r border-gray-300 pr-2"
                  style={{ flex: "1", minWidth: "100px" }}
                >
                  <p className="text-gray-600">৳{item.price}</p>
                </div>

                {/* Right column: Total */}
                <div
                  className="flex items-center justify-end"
                  style={{ flex: "1", minWidth: "200px" }}
                >
                  <p className="text-gray-600 flex items-center justify-between">
                    <span>
                      Total: {item.quantity}
                      {item.unit} * ৳{item.price} =৳
                    </span>
                    <span>{item.quantity * item.price}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Total price of the entire cart */}
          <div className="flex justify-end mt-4">
            <p className="text-lg font-semibold">
              Total Price: ৳
              {cart.reduce(
                (total, item) => total + item.quantity * item.price,
                0
              )}
            </p>
          </div>

          <div className="mt-8">
            <button
              onClick={handleOrder}
              className="bg-green-600 text-white px-4 py-2 rounded-md mr-4"
            >
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
