"use client";

import React, { useEffect, useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import Navbar from "../Components/Navbar"; 

export default function ViewOrder() {
  const [list, setList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [startDate,setStartDate]=useState("")
  const [endDate,setEndDate]=useState("")
  const [pageNo,setPageNo]=useState(1)
  const [totalPage,setTotalPage]=useState("")
  const [Loading,setLoading]=useState(true)
  const limit=5
  const searchParams=useSearchParams()
  const [hydrated,setHydrated]=useState(false)
const buildQuery = (page = pageNo) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  params.append("pageNo", page);
  return params.toString();
};
useEffect(() => {
  // Skip initial hydration to avoid pushing on first render
  if (!hydrated) return;

  const query = buildQuery(pageNo);
  router.push(`?${query}`, { scroll: false });
}, [search, startDate, endDate, pageNo]);

  useEffect(()=>{
    
    const page=Number(searchParams.get("pageNo")||1)
    const start= searchParams.get("startDate")||""
    const end= searchParams.get("endDate")||""
    const searchval= searchParams.get("search")||""
    setPageNo(page)
    setEndDate(end)
    setStartDate(start)
    setSearch(searchval)
     setHydrated(true)
  },[searchParams])

  const updatePage = (newPage) => {
  setPageNo(newPage);
  const params = new URLSearchParams();
  if(search) params.append("search", search);
  if(startDate) params.append("startDate", startDate);
  if(endDate) params.append("endDate", endDate);
  params.append("pageNo", newPage);
  router.push(`?${params.toString()}`);
};



  useEffect(() => {
    if(!hydrated) return
    const OrderList = async () => {
      const token = localStorage.getItem("token");
      const params=new URLSearchParams()
      if(pageNo) params.append("pageno",pageNo)
        if(startDate) params.append("startDate",startDate)
          if(endDate) params.append("endDate",endDate)
            if(search) params.append("search",search)
              
params.append("limit", limit);
      try {
     const url= startDate||endDate||search? `https://auth-backend-c94t.onrender.com/api/auth/get-searchOrder?${params.toString()}`:
       `https://auth-backend-c94t.onrender.com/api/auth/get-Order/${limit}/${pageNo}`
        
        const response = await fetch(url
         ,
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
          setList(data.order||data.result);
          setTotalPage(data.totalPages||data.totalPage)
          
          
        } else if (response.status === 401) {
          alert("Token expired");
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert(error.message);
      }finally{
        setLoading(false)
      }
    };
    OrderList();
  }, [refresh,pageNo,hydrated]);

  // Cancel order
  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/cancel-order/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setRefresh((prev) => !prev);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Refund order
  const handleRefund = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/update-refund/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) alert("Request sent");
      else if (response.status === 403) alert(data.message);
      else alert(data.message);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [pageNo]);

  const handleSearch = async () => {
    try {
     
      if(search||startDate||endDate){
       setPageNo(1)
      const token = localStorage.getItem("token");
      const params=new URLSearchParams()
      if(search) params.append("search",search)
        if(startDate) params.append("startDate",startDate)
          if(endDate) params.append("endDate",endDate)
            params.append("pageno",pageNo)
          params.append("limit",limit)
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/get-searchOrder?${params.toString()}`,
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
    setSearch("")
    setPageNo(1)
    const params = new URLSearchParams();
  params.append("pageNo", 1); 
  params.append("limit", limit); 

  router.push(`?${params.toString()}`);
    setRefresh(prev=>!prev)
  } 
 

if (Loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
        Loading.....
      </h2>
    </div>
  );
}

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-6 px-4">
        {/* Heading */}
       <div className="flex items-center justify-between mb-6 sm:mb-10">
  {/* Left spacer */}
  <div className="w-1/3"></div>

  {/* Center heading */}
  <h2
    className="w-1/3 text-center font-bold text-gray-800
               text-lg sm:text-xl md:text-2xl lg:text-3xl
               whitespace-nowrap"
  >
    Order History
  </h2>

  {/* Right close button */}
  <div className="w-1/3 flex justify-end">
    <button
      onClick={() => router.push("/landing")}
      className="text-gray-500 hover:text-gray-800
                 text-2xl sm:text-3xl font-bold transition"
    >
      &times;
    </button>
  </div>
</div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3 mb-8">
  
  {/* Search input */}
  <input
    type="text"
    placeholder="Search orders..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full sm:max-w-md px-4 py-2 border border-indigo-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />

  {/* Start Date */}
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

  {/* End Date */}
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

  {/* Search Button */}
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


        {/* Orders */}
        <div className="flex flex-col gap-6 max-w-6xl mx-auto">
          {list.length === 0 ? (
            <p className="text-center text-gray-500">No orders found.</p>
          ) : (
            list.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-2xl p-6 flex flex-col md:flex-row md:justify-between items-start gap-6 transition"
              >
                {/* Order Info */}
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-gray-800 font-semibold">
                    Order ID: <span className="font-normal">{order._id}</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Status: <span className="font-normal">{order.orderstatus}</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Payment: <span className="font-normal">{order.paymentstatus}</span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Amount: <span className="font-normal">${order.amount}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleRefund(order._id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium"
                  >
                    Refund
                  </button>

                  <button
                    onClick={() => router.push(`items/${order._id}`)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    View Items
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Pagination */}
<div className="flex items-center justify-center gap-4 mt-8">
  {/* Previous Button */}
  <button
    disabled={pageNo === 1}
    onClick={() => updatePage(pageNo-1)}
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
    onClick={() => updatePage(pageNo+1)}
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
