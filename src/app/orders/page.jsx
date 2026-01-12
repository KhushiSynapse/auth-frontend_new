"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ViewOrder() {
  const [list, setList] = useState([])
  const [refresh, setRefresh] = useState(false)
  const router = useRouter()
  const [search, setSearch] = useState("")

  // Fetch all orders initially or on refresh
  useEffect(() => {
    const OrderList = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/get-OrderItem",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        )
        const data = await response.json()
        if (response.ok) setList(data)
        else if (response.status === 401) {
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert(error.message)
      }
    }
    OrderList()
  }, [refresh])

  // Cancel order
  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/cancel-order/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (response.ok) {
        alert(data.message)
        setRefresh((prev) => !prev)
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert(error.message)
    }
  }

  // Refund order
  const handleRefund = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/update-refund/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (response.ok) alert("Request sent")
      else if (response.status === 403) alert(data.message)
      else alert(data.message)
    } catch (error) {
      alert(error.message)
    }
  }

  // Search orders by product name
  const handleSearch = async (search) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/get-searchOrder/${search}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      )
      const data = await response.json()
      if (response.ok) setList(data)
      else alert(data.message)
    } catch (error) {
      alert(error.message)
    }
  }

  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search) handleSearch(search)
      else setRefresh((prev) => !prev)
    }, 500)

    return () => clearTimeout(handler)
  }, [search])

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-4">Your Orders</h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
        <button
          onClick={() => handleSearch(search)}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {/* Order List */}
      <div className="flex flex-col gap-6">
        {list.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <div className="flex-1 flex flex-col md:flex-row md:justify-between w-full">
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 mt-1">Price: ${item.price}</p>
                <p className="text-gray-600 mt-1">Quantity: {item.Quantity}</p>
                <p className="text-gray-600 mt-1">Total Price: ${item.total}</p>
                <p className="text-gray-600 mt-1">Order status: {item.orderid.orderstatus}</p>
                <p className="text-gray-600 mt-1">OrderId: {item.orderid._id}</p>
                <p className="text-gray-600 mt-1">Payment Status: {item.orderid.paymentstatus}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-1 mt-2 md:mt-2 items-center">
                <button
                  onClick={() => handleCancel(item.orderid._id)}
                  className="h-9 px-3 rounded-md text-sm font-medium 
                             bg-red-500 text-white 
                             hover:bg-red-600 
                             active:bg-red-700 
                             focus:outline-none focus:ring-2 focus:ring-red-400 
                             transition"
                >
                  Cancel
                </button>

                <button
                  onClick={() => handleRefund(item.orderid._id)}
                  className="h-9 px-3 rounded-md text-sm font-medium 
                             bg-yellow-500 text-white 
                             hover:bg-yellow-600 
                             active:bg-yellow-700 
                             focus:outline-none focus:ring-2 focus:ring-yellow-400 
                             transition"
                >
                  Refund
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
