"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/cart/cart-context";
import { ROUTES } from "@/routes/routes";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth/auth-context";
import { useAuthModal } from "@/contexts/auth/login-modal";
import Cookies from "js-cookie";
import Swal from "sweetalert2"; // Import SweetAlert
import { getSelectedZone } from "@/utils/getSelectedZone";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useAuthModal();
  const [authToken, setAuthToken] = useState(Cookies.get("authToken"));
  const savedZone = getSelectedZone();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      setAuthToken(Cookies.get("authToken"));
    }
  }, [isAuthenticated]);

  const handleOrder = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to confirm this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    });

    if (result.isConfirmed) {
      try {
        const zoneResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.ZONES}`
        );
        if (!zoneResponse.ok) {
          throw new Error("Failed to fetch zones");
        }
        const zonesData = await zoneResponse.json();
        const zone = zonesData.find((zone) => zone.name === savedZone);

        if (!zone) {
          throw new Error("Selected zone not found in zones data");
        }

        const productData = cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        }));

        const orderData = {
          zone_id: zone.id,
          product: productData,
        };

        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(orderData),
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.ORDER}`,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Failed to send order data");
        }

        toast.success("Order placed successfully");
        clearCart();
        router.push("/");
      } catch (error) {
        console.error("Error sending order data:", error.message);
        toast.error("Error placing the order");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="flex-grow container mx-auto px-4 py-8 max-w-screen-sm rounded-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Checkout Items
        </h2>
        {cart.length === 0 ? (
          <p className="text-gray-800">Your cart is empty.</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-md shadow-md p-4 flex items-center justify-between bg-white"
                >
                  <div className="flex items-center">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMG_URL}${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 mr-4 rounded-md"
                    />
                    <div>
                      <p className="text-gray-800 font-semibold">{item.name}</p>
                      <p className="text-gray-600">৳{item.price} each</p>
                      <p className="text-gray-600">
                        Total: {item.quantity} {item.unit} = ৳
                        {item.quantity * item.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleOrder}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Confirm Order
              </button>

              <p className="text-lg font-semibold">
                Total Price: ৳
                {cart.reduce(
                  (total, item) => total + item.quantity * item.price,
                  0
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
