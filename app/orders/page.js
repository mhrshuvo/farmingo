"use client";

import Footer from "@/components/footer/footer";
import { ROUTES } from "@/routes/routes";
import { getAuthToken } from "@/utils/getAuthToken";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const authToken = getAuthToken();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.MY_ORDERS}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [authToken]);

  return (
    <>
      <div className="container mx-auto h-screen p-4">
        <div>
          <h1 className="text-3xl font-semibold text-center my-5">My Orders</h1>
        </div>
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="text-center my-5">
              <p className="text-lg font-medium">No orders found.</p>
            </div>
          ) : (
            <table className="w-full table-auto bg-white border border-gray-200 mb-10">
              <thead className="text-white">
                <tr>
                  <th className="px-4 py-2 bg-[#223d34] border-b border-r text-center">
                    Order ID
                  </th>
                  <th className="px-4 py-2 bg-[#223d34] border-b border-r text-center">
                    Amount
                  </th>
                  <th className="px-4 py-2 bg-[#223d34] border-b border-r text-center">
                    Status
                  </th>
                  <th className="px-4 py-2 bg-[#223d34] border-b text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-2 border-b border-r text-center">
                      {order.id}
                    </td>
                    <td className="px-4 py-2 border-b border-r text-center">
                      {order.total_amount} ৳
                    </td>
                    <td className="px-4 py-2 border-b border-r text-center">
                      {order.status}
                    </td>

                    <td className="px-4 py-2 border-b text-center">
                      <Link href={`/orders/${order.id}`}>
                        <p className="text-green-800 font-bold">Details</p>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OrderTable;
