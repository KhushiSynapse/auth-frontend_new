"use client"

import React, { useEffect, useState } from "react"
import {useRouter} from "next/navigation"

export default function OrderLog() {
  const [orders, setOrders] = useState([])
  const router=useRouter()
  useEffect(() => {
    const getorderId = async () => {
      try {
        const token=localStorage.getItem("token")
        const response = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/get-Orderid",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()
        if (response.ok) {
          setOrders(data)
        }
      } catch (error) {
        alert(error.message)
      }
    }

    getorderId()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      
      {/* Page Title */}
      <h2 className="text-2xl font-semibold text-center mb-6">
        Orders
      </h2>

      {/* Orders List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {orders.map((orderid) => (
          <div
            key={orderid._id}
            className="flex flex-col sm:flex-row items-center justify-between 
                       bg-white rounded-lg shadow-sm border 
                       p-4 gap-4"
          >
            {/* Order ID */}
            <h5 className="text-sm sm:text-base font-medium text-gray-700">
              Order ID: <span className="font-semibold">{orderid._id}</span>
            </h5>

            {/* Button */}
            <button onClick={()=>router.push(`/details/${orderid._id}`)}
              className="w-full sm:w-auto px-4 py-2 
                         bg-blue-600 text-white text-sm font-medium 
                         rounded-md hover:bg-blue-700 
                         transition duration-200"
            >
              View Order
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
