import React, { useEffect, useRef } from "react";
import { RiCloseLine } from "react-icons/ri";

const CartSidebar = ({ isOpen, toggle }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!sidebarRef.current.contains(event.target)) {
        toggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, toggle]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 right-0 z-50 w-full md:w-80 bg-white shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Cart</h2>
        <button className="text-gray-600 focus:outline-none" onClick={toggle}>
          <RiCloseLine />
        </button>
      </div>
      <div className="px-4 py-6">
        {/* Your cart content goes here */}
        <p className="text-gray-800">Your cart items...</p>
      </div>
    </div>
  );
};

export default CartSidebar;
