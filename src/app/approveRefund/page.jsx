"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Components/Navbar";

export default function ApproveRefund() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const getList = async () => {
      try {
        const response = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/get-RefundList",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setList(data);
        } else {
          alert(data.message);
          router.push("/landing");
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    getList();
  }, []);

  const handleApprove = async (id, uid) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/get-refund/${id}/${uid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Refund successful");
        setList((prev) => prev.filter((order) => order._id !== id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  {if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
        Loading.....
      </h2>
    </div>
  );
}}
  return (
    <>
    <Navbar/>
   
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Heading with Close Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Refund Requests</h2>
        <button
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-800 transition text-2xl font-bold"
          title="Close"
        >
          &times;
        </button>
      </div>

      {/* Refund Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length > 0 ? (
          list.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-2xl hover:shadow-2xl transition p-5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <p className="text-gray-700 font-medium">
                  <span className="font-semibold">User ID:</span> {order.userid}
                </p>
                <p className="text-gray-700 font-medium">
                  <span className="font-semibold">Amount:</span> ₹{order.amount}
                </p>
                <p className="text-gray-700 font-medium">
                  <span className="font-semibold">Order Status:</span> {order.orderstatus}
                </p>
                <p className="text-gray-700 font-medium">
                  <span className="font-semibold">Payment Status:</span> {order.paymentstatus}
                </p>
              </div>

              <button
                onClick={() => handleApprove(order._id, order.userid)}
                className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Approve Refund
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 mt-10">
            No refund requests
          </p>
        )}
      </div>
    </div>
     </>
  );
}
