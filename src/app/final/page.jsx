"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Message() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderid");
  const amount = searchParams.get("amount");

  return (
    <>
      {/* Close Button */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50">
        <button
          onClick={() => router.push("/landing")}
          className="text-red-600 text-2xl font-bold hover:text-red-800 transition"
        >
          ✖
        </button>
      </div>

      {/* Page Wrapper */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 md:px-8">
        {/* Card Container */}
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 sm:p-6 md:p-8 text-center transition-shadow duration-300 hover:shadow-blue-200">
          
          {/* Success Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
            Payment Successful ✅
          </h2>

          {/* Message */}
          <div className="mt-4 space-y-2 text-gray-700 text-sm sm:text-base">
            <p>Thank you for your purchase.</p>
            <p>Your payment has been received successfully.</p>
          </div>

          {/* Order Details */}
          <div className="mt-6 border-t pt-4 text-left space-y-4 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Amount Paid</span>
              <span className="font-semibold text-gray-900">${amount}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-900">PayPal</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Order ID</span>
              <span className="font-semibold text-gray-900 break-all">{orderId}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium text-gray-600">Status</span>
              <span className="font-semibold text-green-600">Completed</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => router.push("/listProduct")}
            className="mt-8 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition transform duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}
