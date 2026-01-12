"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function Transaction() {
  const [list, setList] = useState([])
  const { id } = useParams()

  useEffect(() => {
    const getItemDetails = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(
          `https://auth-backend-c94t.onrender.com/api/auth/get-productdetails/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()
        if (response.ok) {
          setList(data)
        } else {
          alert("Error fetching details")
        }
      } catch (error) {
        alert(error.message)
      }
    }

    getItemDetails()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      
      {/* Page Heading */}
      <h2 className="text-2xl font-semibold text-center mb-8">
        Product Details
      </h2>

      {/* Products Container */}
      <div className="max-w-4xl mx-auto space-y-6">
        {list.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-lg shadow p-5 flex flex-col md:flex-row md:justify-between items-center gap-4"
          >
            {/* Product Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-600 mt-1">Price: ${item.price}</p>
              <p className="text-gray-600 mt-1">Quantity: {item.Quantity}</p>
              <p className="text-gray-600 mt-1 font-medium">
                Total Price: ${item.total}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
