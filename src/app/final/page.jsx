"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Message() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderid");
  const amount = searchParams.get("amount");

  return (<>
    <div className="absolute top-5 right-5">
  <button onClick={()=>router.push("/landing")} className="text-red-600 text-2xl font-bold hover:text-red-800 transition">
    ✖
  </button>
</div>

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
        
  
        {/* Success Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-green-600">
          Payment Successful ✅
        </h2>

        {/* Message */}
        <div className="mt-4 space-y-2 text-gray-700 text-sm sm:text-base">
          <p>Thank you for your purchase.</p>
          <p>Your payment has been received successfully.</p>
        </div>

        {/* Order Details */}
        <div className="mt-6 border-t pt-4 text-left space-y-3 text-sm sm:text-base">
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
            <span className="font-semibold text-gray-900 break-all">
              {orderId}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Status</span>
            <span className="font-semibold text-green-600">Completed</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => router.push("/listProduct")}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
    </>
  );
}
