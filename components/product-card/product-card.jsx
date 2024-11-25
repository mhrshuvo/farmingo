"use client";

import { useCart } from "@/contexts/cart/cart-context";
import React from "react";
import toast from "react-hot-toast";
import { FaPlus, FaMinus } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { name, price, image, unit, type, id } = product;
  const { addItemToCart, decreaseQuantity, getItemQuantity } = useCart();

  // Get the quantity of the product from the cart context
  const quantity = getItemQuantity(id);

  const handleAddToCart = () => {
    addItemToCart(product);
    toast.success("Added to Cart");
  };

  const handleIncreaseQuantity = () => {
    addItemToCart(product); // Just add one more item to the cart
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      decreaseQuantity(id); // Decrease the quantity by 1
    } else if (quantity === 1) {
      decreaseQuantity(id); // Decrease the quantity to 0
      toast.success("Removed from Cart");
    }
  };

  return (
    <div className="w-[180px] md:w-[200px] h-[300px] mx-auto shadow-xl bg-white border rounded-xl flex flex-col justify-between">
      <img
        className="w-full mx-auto my-2 h-[50%] object-cover"
        src={`${process.env.NEXT_PUBLIC_IMG_URL}${image}`}
        alt="Product Image"
      />
      <div className="px-4 py-2">
        <div className="font-semibold mb-2 text-gray-800 truncate">{name}</div>
        <div className="text-sm text-gray-600 mb-2">{type}</div>
        <div className="flex items-center">
          <div className="font-bold text-lg text-[#145D4C]">৳ {price}</div>
          <div className="ml-2 text-sm font-bold text-gray-600">/{unit}</div>
        </div>
      </div>
      <div className="flex justify-center items-center my-2">
        {quantity === 0 ? (
          <button
            className="bg-green-600 px-6 py-2 rounded-lg text-white"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              className="bg-gray-300 p-2 rounded-full"
              onClick={handleDecreaseQuantity}
            >
              <FaMinus className="w-4 h-4 text-gray-700" />
            </button>
            <span className="font-semibold">{quantity}</span>
            <button
              className="bg-gray-300 p-2 rounded-full"
              onClick={handleIncreaseQuantity}
            >
              <FaPlus className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
