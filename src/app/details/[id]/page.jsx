"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Navbar from "@/app/Components/Navbar";

export default function Details() {
  const [order, setOrder] = useState({});
  const router = useRouter();
  const { id } = useParams();
  const fetchedRef = useRef(false);
  const searchParams = useSearchParams();

  // Extract only the filter params
  const page = searchParams.get("pageNo");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const getDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/get-orderdetails/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOrder(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (!fetchedRef.current) {
      getDetails();
      fetchedRef.current = true;
    }
  }, []);

 
  const buildQuery = () => {
    const params = new URLSearchParams();
    if (page) params.append("pageNo", page);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    return params.toString();
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-4 py-8">
       
<div className="flex items-center justify-between mb-10">
  {/* Left spacer */}
  <div className="w-1/3"></div>

  {/* Center heading */}
  <h2 className="text-3xl font-bold text-gray-800 text-center w-1/3">
    Order History
  </h2>

  {/* Right close button */}
  <div className="w-1/3 flex justify-end">
    <button
      onClick={() => router.push(`/orderlog?${buildQuery()}`)}
      className="text-gray-500 hover:text-gray-800 text-3xl font-bold transition"
    >
      &times;
    </button>
  </div>
</div>


        {/* Orders Container */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border rounded-xl shadow-xl p-8 flex flex-col sm:flex-row gap-8 min-h-[300px]">
            {/* Order Details - Left */}
            <div className="flex-1 flex flex-col justify-center space-y-4 text-gray-800 text-lg">
              <p>
                <span className="font-semibold text-xl">Order ID:</span>{" "}
                {order._id}
              </p>
              <p>
                <span className="font-semibold text-xl">Placed On:</span>{" "}
                {order.createdat &&
                  new Date(order.createdat).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
              </p>
              <p>
                <span className="font-semibold text-xl">Total Amount:</span> $
                {order.amount}
              </p>
              <p>
                <span className="font-semibold text-xl">Order Status:</span>{" "}
                <span className="capitalize">{order.orderstatus}</span>
              </p>
            </div>

            {/* Action Buttons - Right */}
            <div className="flex flex-col justify-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => router.push(`/user/${order.userid}`)}
                className="px-6 py-3 text-lg font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View User Details
              </button>

              <button
                onClick={() => router.push(`/items/${id}`)}
                className="px-6 py-3 text-lg font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                View Product Details
              </button>

              <button
                onClick={() => router.push(`/transactiondetails/${id}`)}
                className="px-6 py-3 text-lg font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                View Transaction Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
