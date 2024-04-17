import { useCart } from "@/contexts/cart/cart-context";
import { Button } from "@nextui-org/react";
import React from "react";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { name, price, image, unit } = product;
  const { addItemToCart } = useCart();

  const handleAddToCart = () => {
    addItemToCart(product);
    toast.success("Successfully Added");
  };

  return (
    <div className="w-[180px] md:w-[220px] h-[330px] mx-auto bg-white border rounded-md flex flex-col justify-between">
      <img
        className="w-full mx-auto my-2 h-[50%] object-cover"
        src={image}
        alt="Product Image"
      />
      <div className="px-4 py-2">
        <div className="font-semibold  mb-2 text-gray-800">{name}</div>
        <div className="flex items-center">
          <div className="font-bold text-lg text-[#145D4C]"> ৳ {price} </div>
          <div className="ml-2 text-sm font-bold text-gray-600">{unit}</div>
        </div>
      </div>
      <div className="px-4 pb-2">
        {/* Attach handleAddToCart function to the onClick event of the Button */}
        <Button
          className=" bg-green-600 text-white"
          fullWidth
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
