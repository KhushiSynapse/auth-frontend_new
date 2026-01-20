"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Components/Navbar";

export default function Transaction() {
  const [list, setList] = useState([]);
  const router = useRouter();
  const [pageNo,setPageNo]=useState(1)
  const [totalPage,setTotalPage]=useState("")
  const [search,setSearch]=useState("")
  const [paidDate,setPaidDate]=useState("")
  const [endDate,setEndDate]=useState("")
  const limit=5
  const [loading,setLoading]=useState(true)

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://auth-backend-c94t.onrender.com/api/auth/get-transaction/${limit}/${pageNo}`,
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
          setList(data.list);
          setTotalPage(data.totalPage)
          setLoading(false)
        } else {
          alert("Error fetching transactions");
        }
      } catch (error) {
        alert(error.message);
      }
    };

    getTransaction();
  }, [pageNo]);
  const handleSearch = async () => {
      try {
        if(search||paidDate){
        const token = localStorage.getItem("token");
        const params=new URLSearchParams()
        if(search) params.append("search",search)
          if(paidDate) params.append("paidDate",paidDate)
            if(endDate) params.append("endDate",endDate)
              params.append("pageno",pageNo)
            params.append("limit",limit)
        const response = await fetch(
          `https://auth-backend-c94t.onrender.com/api/auth/get-searchTransaction?${params.toString()}`,
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
          setList(data.result);
          setTotalPage(data.totalPage)
        }
        else alert(data.message);
     } else{
      alert("Search is empty")
     }
      } catch (error) {
        alert(error.message);
      }
    };
  
    useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [pageNo]);

   

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
    <Navbar/>
   
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header with centered title and close button */}
      <div className="relative mb-8 h-12">
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
               text-lg sm:text-xl md:text-2xl font-bold text-gray-800
               whitespace-nowrap">
  Transaction History
</h1>


        <button
          onClick={() => router.back()}
          aria-label="Go back"
          title="Go back"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 text-3xl font-bold select-none"
        >
          &times;
        </button>
      </div>
<div className="flex flex-col gap-3 mb-8 w-full
                md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-3">


  {/* Search Input */}
  <input
    type="text"
    placeholder="Search using payment status..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:max-w-md px-4 py-2
               border border-indigo-400 rounded-md
               focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />

  {/* Start Date */}
  <div className="flex items-center gap-2 w-full md:w-auto">
    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
      Start Date:
    </label>
    <input
      type="date"
      value={paidDate}
      onChange={(e) => setPaidDate(e.target.value)}
      className="w-full md:w-auto px-4 py-2
                 border border-indigo-400 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* End Date */}
  <div className="flex items-center gap-2 w-full md:w-auto">
    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
      End Date:
    </label>
    <input
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      className="w-full md:w-auto px-4 py-2
                 border border-indigo-400 rounded-md
                 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Search Button */}
  <button
    onClick={handleSearch}
    className="w-full md:w-auto px-6 py-2
               bg-indigo-600 text-white rounded-md
               hover:bg-indigo-700 transition"
  >
    Search
  </button>
</div>

      {/* Transactions Container */}
      <div className="max-w-4xl mx-auto space-y-6">
        {list.map((history, index) => (
          <div
            key={index}
            className="bg-white shadow-2xl rounded-lg p-5 flex flex-col gap-3"
          >
            {/* Order ID */}
            <p className="font-semibold text-lg text-gray-800">
              Order #{history.orderId}
            </p>

            {/* Order Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
              <p>
                <span className="font-medium">Amount:</span> ${history.amount}
              </p>
              <p>
                <span className="font-medium">Currency:</span> {history.currency}
              </p>
              <p>
                <span className="font-medium">Payment Method:</span>{" "}
                {history.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Payment Status:</span>{" "}
                {history.paymentStatus}
              </p>
            </div>

            {/* Dates */}
            <div className="text-sm text-gray-600 mt-2 space-y-1">
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
                  {new Date(history.paymentCancelledAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}

              {history.refundRequestedAt && (
                <p>
                  <span className="font-medium">Refund Requested:</span>{" "}
                  {new Date(history.refundRequestedAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}

              {history.paymentRefundedAt && (
                <p>
                  <span className="font-medium">Refunded At:</span>{" "}
                  {new Date(history.paymentRefundedAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 mt-8">
  {/* Previous Button */}
  <button
    disabled={pageNo === 1}
    onClick={() => setPageNo(prev => prev - 1)}
    className={`px-4 py-2 rounded-md font-medium transition ${
      pageNo === 1
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }`}
  >
    Previous
  </button>

  {/* Page Info */}
  <span className="text-gray-700 font-medium">
    Page {pageNo} of {totalPage || 1}
  </span>

  {/* Next Button */}
  <button
    disabled={pageNo === totalPage || totalPage === 0}
    onClick={() => setPageNo(prev => prev + 1)}
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
  );
}
