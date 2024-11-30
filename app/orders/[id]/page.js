"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loader from "@/components/loader/Loader";
import html2pdf from "html2pdf.js";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/getAuthToken";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [printing, setPrinting] = useState(false);
  const authToken = getAuthToken();
  const orderDetailsRef = useRef();

  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/consumer/my_order/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.status === 401) {
          router.push("/");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, authToken]);

  const handlePrint = () => {
    setPrinting(true); // Set printing mode to true before generating PDF
    const element = orderDetailsRef.current;
    const options = {
      margin: [10, 10, 10, 10], // top, left, bottom, right
      filename: `order_${id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        setPrinting(false);
      });
  };

  if (!order) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-semibold text-center my-5">
        Order Details
      </h1>
      <div
        ref={orderDetailsRef}
        className="bg-white p-4 md:p-6 shadow-md rounded-lg"
      >
        <div className="printable-area">
          <p className="text-sm md:text-base">
            <strong>Order ID:</strong> {order.id}
          </p>
          <p className="text-sm md:text-base">
            <strong>User:</strong> {order.user}
          </p>
          <p className="text-sm md:text-base">
            <strong>Zone:</strong> {order.zone}
          </p>
          <p className="text-sm md:text-base">
            <strong>Delivery Address:</strong> {order.delivery_address}
          </p>
          <p className="text-sm md:text-base">
            <strong>Total Amount:</strong> {order.total_amount} ৳
          </p>
          <p className="text-sm md:text-base">
            <strong>Status:</strong> {order.status}
          </p>
          <p className="text-sm md:text-base">
            <strong>Created At:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>

          <h2 className="text-lg md:text-2xl font-semibold my-4 md:my-5">
            Order Products
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white border border-gray-200 mb-6">
              <thead className="bg-[#152721] text-white">
                <tr>
                  {!printing && (
                    <th className="px-2 py-2 border-b border-gray-200 text-center text-xs md:text-sm">
                      Product Image
                    </th>
                  )}
                  <th className="px-2 py-2 border-b border-gray-200 text-center text-xs md:text-sm">
                    Product Name
                  </th>
                  <th className="px-2 py-2 border-b border-gray-200 text-center text-xs md:text-sm">
                    Quantity
                  </th>
                  <th className="px-2 py-2 border-b border-gray-200 text-center text-xs md:text-sm">
                    Amount
                  </th>
                  <th className="px-2 py-2 border-b border-gray-200 text-center text-xs md:text-sm">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.order_products.map((product) => (
                  <tr key={product.id}>
                    {!printing && (
                      <td className="px-2 py-2 border-b border-gray-200 text-center">
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMG_URL}/${product.product_image}`}
                          alt={product.product_name}
                          className="h-12 w-12 md:h-16 md:w-16 object-cover mx-auto"
                        />
                      </td>
                    )}
                    <td className="px-2 py-2 border-b border-gray-200 text-center text-xs md:text-sm">
                      {product.product_name}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-200 text-center text-xs md:text-sm">
                      {product.quantity}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-200 text-center text-xs md:text-sm">
                      {product.unit}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-200 text-center text-xs md:text-sm">
                      {product.total_amount} ৳
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-center mt-6 flex flex-col md:flex-row justify-center gap-4">
        <Link href="/orders">
          <button className="bg-green-900 py-2 px-4 rounded-lg text-white font-semibold w-full md:w-auto">
            Back to Orders
          </button>
        </Link>
        <div>
          <button
            onClick={handlePrint}
            className="bg-blue-600 py-2 px-4 rounded-lg text-white font-semibold w-full md:w-auto"
          >
            Print as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
