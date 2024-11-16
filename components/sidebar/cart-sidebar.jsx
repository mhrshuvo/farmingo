"use client";

import React, { useEffect, useRef, forwardRef } from "react";
import { RiCloseLine } from "react-icons/ri";
import { IoMdRemove, IoMdAdd } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";
import { useCart } from "@/contexts/cart/cart-context";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Use forwardRef to forward the ref to the div element
const CartSidebar = forwardRef(({ isOpen, toggle }) => {
  const closeButtonRef = useRef(null); // Ref for the close button
  const sidebarRef = useRef(null); // Ref for the sidebar itself
  const { cart, removeItemFromCart, decreaseQuantity, addItemToCart } =
    useCart();
  const router = useRouter();

  // Close sidebar when clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Ensure sidebarRef and closeButtonRef are not null before proceeding
      if (
        sidebarRef.current &&
        closeButtonRef.current &&
        !sidebarRef.current.contains(event.target) && // If the click is outside the sidebar
        !closeButtonRef.current.contains(event.target) // And outside the close button
      ) {
        toggle(); // Close the sidebar
      }
    };

    // Only add event listener if the sidebar is open
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    // Cleanup event listener when component unmounts or sidebar state changes
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, toggle]); // Dependencies: rerun effect if isOpen or toggle changes

  // Add quantity of an item
  const handleAddQuantity = (item) => {
    const updatedItem = { ...item, quantity: item.quantity + 1 };
    addItemToCart(updatedItem);
  };

  // Remove quantity of an item
  const handleRemoveQuantity = (item) => {
    if (item.quantity === 1) {
      removeItemFromCart(item);
    } else {
      const updatedItem = { ...item, quantity: item.quantity - 1 };
      decreaseQuantity(updatedItem);
    }
  };

  // Delete an item from the cart
  const handleDeleteItem = (item) => {
    removeItemFromCart(item);
    toast.error("Removed From Cart");
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    toggle(); // Close the sidebar
    router.push("/checkout"); // Navigate to checkout
  };

  return (
    <div
      ref={sidebarRef} // Attach the sidebar ref
      className={`fixed inset-y-0 right-0 z-50 w-full md:w-80 bg-gray-300 shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
        <button
          ref={closeButtonRef} // Attach ref to the close button
          aria-label="Close cart"
          className="text-red-600 focus:outline-none"
          onClick={toggle}
        >
          <RiCloseLine size={25} />
        </button>
      </div>
      <div className="px-4 py-6">
        {cart.length === 0 ? (
          <p className="text-gray-800">Your cart is empty.</p>
        ) : (
          <div>
            <ul>
              {cart.map((item) => {
                const [unitAmount, unitType] = item.unit.split(" ");
                const totalAmount = item.quantity * parseInt(unitAmount);

                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between mb-4"
                  >
                    <div className="flex items-center">
                      <img
                        src={
                          item.image
                            ? `${process.env.NEXT_PUBLIC_IMG_URL}${item.image}`
                            : "/placeholder-image.jpg"
                        }
                        alt={item.name}
                        className="w-12 h-12 mr-4 rounded-md"
                      />
                      <div>
                        <p className="text-gray-800">{item.name}</p>
                        <p className="text-gray-600">৳{item.price} each</p>
                        <p className="text-gray-600">
                          Total: {totalAmount}
                          {unitType}
                        </p>
                        Price: ৳{item.quantity * item.price}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        aria-label="Decrease quantity"
                        className="text-gray-600 focus:outline-none"
                        onClick={() => handleRemoveQuantity(item)}
                      >
                        <IoMdRemove className="w-6 h-6" />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        className="text-gray-600 focus:outline-none"
                        onClick={() => handleAddQuantity(item)}
                      >
                        <IoMdAdd className="w-6 h-6" />
                      </button>
                      <button
                        aria-label="Remove item"
                        className="text-gray-600 focus:outline-none ml-4"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <AiOutlineDelete className="w-6 h-6" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <button
              onClick={handleProceedToPayment}
              className="bg-green-600 text-white px-4 py-2 rounded-md mt-4 w-full"
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

// Assign a display name to the component
CartSidebar.displayName = "CartSidebar";

export default CartSidebar;
