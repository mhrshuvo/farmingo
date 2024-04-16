import { Button } from "@nextui-org/react";
import React from "react";

const ProductCard = ({ product }) => {
  const { name, price, image, unit } = product;

  return (
    <div className="w-[170px] h-[330px] md:w-[260px] md:h-[400px] mx-auto bg-white border flex flex-col justify-between">
      <img
        className="w-full mx-auto my-2 h-[50%] object-cover"
        src={image}
        alt="Product Image"
      />
      <div className="px-4 py-2">
        <div className="font-semibold  mb-2 text-gray-800">{name}</div>
        <div className="flex items-center">
          <div className="font-bold text-lg text-green-600">{price} ৳</div>
          <div className="ml-2 text-sm font-bold text-gray-600">{unit}</div>
        </div>
      </div>
      <div className="px-4 pb-2">
        <Button className="bg-[#145D4C] text-white" fullWidth>
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
