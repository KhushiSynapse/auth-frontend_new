"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/Components/Navbar";

export default function Transaction() {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading,setLoading]=useState(true)

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/get-transaction",
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
          setList(data);
          setLoading(false)
        } else {
          alert("Error fetching transactions");
        }
      } catch (error) {
        alert(error.message);
      }
    };

    getTransaction();
  }, []);

 {if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
        Loading.....
      </h2>
    </div>
  );
}
}
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-4 py-6">
        {/* Heading Row */}
       <div className="flex items-center justify-between px-4 md:px-6 mb-6 w-full">
  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
    Transaction History
  </h2>
  <button
    onClick={() => router.back()}
    className="text-gray-600 hover:text-gray-800 text-2xl font-bold"
  >
    ✖
  </button>
</div>


        {/* Transactions Container */}
        <div className="max-w-4xl mx-auto space-y-6">
          {list.map((history, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-2xl p-6  transition-shadow"
            >
              {/* Top Row: Order ID and Status */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-semibold text-gray-800">
                  Order #{history.orderId}
                </p>
                <p className="text-md font-medium text-gray-700">
                  Status: {history.paymentStatus}
                </p>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 mb-2">
                <p>
                  <span className="font-medium">Amount:</span> {history.amount}
                </p>
                <p className="text-right">
                  <span className="font-medium">Currency:</span>{" "}
                  {history.currency}
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {history.paymentMethod}
                </p>
              </div>

              {/* Dates Section */}
              <div className="text-gray-600 text-sm space-y-1">
                <p>
                  <span className="font-medium">Paid At:</span>{" "}
                  {new Date(history.paymentPaidAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>

                {history.paymentCancelledAt && (
                  <p>
                    <span className="font-medium">Cancelled At:</span>{" "}
                    {new Date(history.paymentCancelledAt).toLocaleString(
                      "en-IN",
                      {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </p>
                )}

                {history.refundRequestedAt && (
                  <p>
                    <span className="font-medium">Refund Requested:</span>{" "}
                    {new Date(history.refundRequestedAt).toLocaleString(
                      "en-IN",
                      {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </p>
                )}

                {history.paymentRefundedAt && (
                  <p>
                    <span className="font-medium">Refunded At:</span>{" "}
                    {new Date(history.paymentRefundedAt).toLocaleString(
                      "en-IN",
                      {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}

         
        </div>
      </div>
    </>
  );
}
