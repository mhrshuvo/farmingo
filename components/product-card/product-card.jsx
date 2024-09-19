import { useCart } from "@/contexts/cart/cart-context";
import React from "react";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { name, price, image, unit, type } = product;
  const { addItemToCart } = useCart();

  const handleAddToCart = () => {
    addItemToCart(product);
    toast.success("Successfully Added");
  };

  return (
    <div className="w-[180px] md:w-[200px] h-[300px] mx-auto bg-white border rounded-md flex flex-col justify-between">
      <img
        className="w-full mx-auto my-2 h-[50%] object-cover"
        src={`${process.env.NEXT_PUBLIC_IMG_URL}${image}`}
        alt="Product Image"
      />
      <div className="px-4 py-2">
        <div className="font-semibold mb-2 text-gray-800 truncate">{name}</div>
        <div className="text-sm text-gray-600 mb-2">{type}</div>
        {/* Display product type */}
        <div className="flex items-center">
          <div className="font-bold text-lg text-[#145D4C]">৳ {price}</div>
          <div className="ml-2 text-sm font-bold text-gray-600">/{unit}</div>
        </div>
      </div>
      <div className="flex justify-center items-center my-2">
        {/* Attach handleAddToCart function to the onClick event of the Button */}
        <button
          className="bg-green-600 px-6 py-2 rounded-lg text-white"
          fullWidth
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
