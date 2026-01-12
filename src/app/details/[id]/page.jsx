"use client"

import React, { useEffect, useState } from "react"
import {useRouter,useParams} from "next/navigation"
export default function Details() {
  const [order, setOrder] = useState({})
  const router=useRouter()
  const {id}=useParams()
  useEffect(() => {
    const getDetails = async () => {
      try {
        const token = localStorage.getItem("token")

        const response = await fetch(`https://auth-backend-c94t.onrender.com/api/auth/get-orderdetails/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (response.ok) {
          setOrder(data)
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert(error.message)
      }
    }

    getDetails()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      
      {/* Page Heading */}
      <h2 className="text-2xl font-semibold text-center mb-8">
        Order History
      </h2>

      {/* Orders Container */}
      <div className="max-w-5xl mx-auto space-y-6">
       
          <div
           
            className="bg-white border rounded-lg shadow-sm p-5"
          >
            {/* Order Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700">
              <p>
                <span className="font-medium">Order ID:</span>{" "}
                {order._id}
              </p>
              <p>
                <span className="font-medium">Placed On:</span>{" "}
                {new Date(order.createdat).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
              </p>
              <p>
                <span className="font-medium">Total Amount:</span>{" "}
                ₹{order.amount}
              </p>
              <p>
                <span className="font-medium">Order Status:</span>{" "}
                <span className="capitalize">{order.orderstatus}</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button onClick={()=>router.push(`/user/${order.userid}`)}
                className="flex-1 px-4 py-2 text-sm font-medium 
                           bg-blue-600 text-white rounded-md 
                           hover:bg-blue-700 transition"
              >
                View User Details
              </button>

              <button onClick={()=>router.push(`/items/${id}`)}
                className="flex-1 px-4 py-2 text-sm font-medium 
                           bg-green-600 text-white rounded-md 
                           hover:bg-green-700 transition"
              >
                View Product Details
              </button>

              <button onClick={()=>router.push(`/transactiondetails/${id}`)}
                className="flex-1 px-4 py-2 text-sm font-medium 
                           bg-purple-600 text-white rounded-md 
                           hover:bg-purple-700 transition"
              >
                View Transaction Details
              </button>
            </div>
          </div>
        
      </div>
    </div>
  )
}
