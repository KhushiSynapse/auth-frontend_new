"use client";

import React, { useEffect, useState } from "react";
import {useParams} from "next/navigation"
export default function Transaction() {
  const [data, setData] = useState({});
  const {id}=useParams()
  useEffect(() => {
    const getTransaction = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://auth-backend-c94t.onrender.com/api/auth/get-transactiondetails/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setData(data);
        } else {
          alert("Error fetching transactions");
        }
      } catch (error) {
        alert(error.message);
      }
    };

    getTransaction();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Page Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        Transaction History
      </h2>

      {/* Transactions Container */}
      <div className="max-w-4xl mx-auto space-y-6">
        
          <div
            
            className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-2"
          >
            <p className="font-semibold text-lg text-gray-800">
              Order #{data.orderId}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
             
              
              <p>
                <span className="font-medium">Payment Method:</span>{" "}
                {data.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {data.paymentStatus}
              </p>
            </div>

            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <p>
                <span className="font-medium">Paid At:</span>{" "}
                {new Date(data.paymentPaidAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              {data.paymentCancelledAt && (
                <p className="text-red-600">
                  <span className="font-medium">Cancelled At:</span>{" "}
                  {new Date(data.paymentCancelledAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}

              {data.refundRequestedAt && (
                <p className="text-yellow-600">
                  <span className="font-medium">Refund Requested:</span>{" "}
                  {new Date(data.refundRequestedAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}

              {data.paymentRefundedAt && (
                <p className="text-green-600">
                  <span className="font-medium">Refunded At:</span>{" "}
                  {new Date(data.paymentRefundedAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </div>
          </div>
       
      </div>
    </div>
  );
}
