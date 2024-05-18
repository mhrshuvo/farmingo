"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@nextui-org/react";
import Loader from "@/components/loader/Loader";
import html2pdf from "html2pdf.js";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [printing, setPrinting] = useState(false); // State to track printing mode
  const authToken = localStorage.getItem("authToken");
  const orderDetailsRef = useRef();

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
        setPrinting(false); // Set printing mode back to false after generating PDF
      });
  };

  if (!order) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4 lg:h-[70vh] h-full">
      <h1 className="text-3xl font-semibold text-center my-5">Order Details</h1>
      <div ref={orderDetailsRef} className="bg-white p-6 shadow-md rounded-lg">
        <div className="printable-area">
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>User:</strong> {order.user}
          </p>
          <p>
            <strong>Zone:</strong> {order.zone}
          </p>
          <p>
            <strong>Delivery Address:</strong> {order.delivery_address}
          </p>
          <p>
            <strong>Amount:</strong> {order.total_amount} ৳
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(order.created_at).toLocaleString()}
          </p>

          <h2 className="text-2xl font-semibold my-5">Order Products</h2>
          <div>
            <table className="w-full table-auto mx-auto bg-white border border-gray-200 mb-10">
              <thead className="bg-[#152721] text-white">
                <tr>
                  {!printing && (
                    <th className="px-2 py-2 border-b border-gray-200 text-center">
                      Product Image
                    </th>
                  )}
                  <th className="px-2 py-2 border-b border-gray-200 text-center">
                    Product Name
                  </th>
                  <th className="px-2 py-2 border-b border-gray-200 text-center">
                    Quantity
                  </th>

                  <th className="px-2 py-2 border-b border-gray-200 text-center">
                    Total Amount
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
                          className="h-8 w-8 object-cover mx-auto md:h-12 md:w-12"
                        />
                      </td>
                    )}
                    <td className="px-2 py-2 border-b border-gray-200 text-center">
                      {product.product_name}
                    </td>
                    <td className="px-2 py-2 border-b border-gray-200 text-center">
                      {product.quantity} {product.unit}
                    </td>

                    <td className="px-2 py-2 border-b border-gray-200 text-center">
                      {product.total_amount} ৳
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-center mt-10 flex flex-col md:flex-row justify-center gap-4 no-print">
        <Link href="/orders">
          <button className="bg-green-900 py-2 px-4 rounded-lg text-white font-semibold">
            Back to Orders
          </button>
        </Link>
        <button
          onClick={handlePrint}
          className="bg-blue-600 py-2 px-4 rounded-lg text-white font-semibold"
        >
          Print as PDF
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
