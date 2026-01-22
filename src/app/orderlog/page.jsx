"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "../Components/Navbar"

export default function OrderLog() {
  const [orders, setOrders] = useState([])
  const router = useRouter()
  const [pageNo, setPageNo] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const limit = 10
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false);
  const [refresh,setRefresh]=useState(false)

  // Build query string from state
  const buildQuery = () => {
    const params = new URLSearchParams()
    if (pageNo) params.append("pageNo", pageNo)
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)
    return params.toString()
  }

  // Hydrate state from URL params
  useEffect(() => {
    const page = Number(searchParams.get("pageNo")) || 1
    const start = searchParams.get("startDate") || ""
    const end = searchParams.get("endDate") || ""

    setPageNo(page)
    setStartDate(start)
    setEndDate(end)
    setHydrated(true);
  }, [searchParams])

  // Fetch orders whenever filters or page change
  useEffect(() => {
    if (!hydrated) return;
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        let url

        if (startDate || endDate) {
          const params = new URLSearchParams()
          params.append("limit", limit)
          params.append("pageNo", pageNo)
          if (startDate) params.append("startDate", startDate)
          if (endDate) params.append("endDate", endDate)

          url = `https://auth-backend-c94t.onrender.com/api/auth/get-searchOrderIds?${params.toString()}`
        } else {
          url = `https://auth-backend-c94t.onrender.com/api/auth/get-Orderid/${limit}/${pageNo}`
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (response.ok) {
          setOrders(data.result || data.list || [])
          setTotalPage(data.totalPage || 1)
          
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [pageNo,hydrated,refresh])

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [pageNo])

  // Handle search button
   const handleSearch = async () => {
    try {
      if(startDate||endDate){
      const token = localStorage.getItem("token");
      const params=new URLSearchParams()
      
        if(startDate) params.append("startDate",startDate)
          if(endDate) params.append("endDate",endDate)
            params.append("pageno",pageNo)
          params.append("limit",limit)
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/get-searchOrderIds?${params.toString()}`,
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
        setOrders(data.result);
        setTotalPage(data.totalPage)
        setPageNo(data.PageNum||1)
      }
      else alert(data.message);}
      else{
        alert("Search is empty")
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const clearFilters=()=>{
    setStartDate("")
    setEndDate("")
    setPageNo(1)
    setRefresh(prev=>!prev)
    router.push("?page=1")
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
          Loading.....
        </h2>
      </div>
    )
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-6">
        {/* Header */}
        <div className="w-full flex items-center justify-center relative mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Orders</h2>

          <button
            onClick={() => router.push("/adminpanel")}
            className="absolute right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold transition"
            title="Close"
          >
            &times;
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3 mb-8">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Start Date:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-indigo-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              End Date:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-indigo-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Search
          </button>

          {(startDate || endDate) && (
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-indigo-500 text-white rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* Orders List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order._id}
                className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow-2xl p-4 hover:shadow-2xl transition gap-4"
              >
                <div className="flex-1 text-gray-700 font-medium">
                  <span className="text-gray-800 font-semibold">Order ID:</span>{" "}
                  {order._id}
                </div>

                <button
                  onClick={() =>
                    router.push(`/details/${order._id}?${buildQuery()}`)
                  }
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
                >
                  View Order
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No orders found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            disabled={pageNo === 1}
            onClick={() => setPageNo((prev) => prev - 1)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              pageNo === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {pageNo} of {totalPage || 1}
          </span>

          <button
            disabled={pageNo === totalPage || totalPage === 0}
            onClick={() => setPageNo((prev) => prev + 1)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              pageNo === totalPage || totalPage === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}
