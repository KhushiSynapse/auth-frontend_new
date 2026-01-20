"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { socket } from "../socket/page";
import Navbar from "../Components/Navbar";

export default function ListProduct() {
  const [list, setList] = useState([]);
  const [pageNo,setPageNo]=useState(1)
  const limit=6
  const [totalPage,setTotalPage]=useState("")
  const router = useRouter();
  const [Loading,setLoading]=useState(true)

  const addCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/save-product/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://auth-backend-c94t.onrender.com/api/auth/list-products/${limit}/${pageNo}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setList(data.result);
          setTotalPage(data.totalPage)
          setLoading(false)
        } else if (response.status === 401) {
          alert("Token expired");
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        alert(error.message);
      }
    };
    getAllProducts();

    socket.connect();
    const handleList = (newProduct) => {
      setList((prev) => {
        if (prev.some((p) => p._id === newProduct._id)) return prev;
        return [newProduct, ...prev];
      });
    };
    socket.on("product:added", handleList);
    return () => {
      socket.off("product:added", handleList);
      socket.disconnect();
    };
  }, [pageNo]);

  const handleClick = (id) => {
    router.push(`/product/${id}`);
  };
    useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageNo]);
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
      <div className="min-h-screen bg-gray-100 py-6">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto flex items-center justify-between mb-6 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
          <button
            onClick={() => router.push("/landing")}
            className="text-red-600 text-2xl font-bold hover:text-red-800 transition"
          >
            ✖
          </button>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4">
          {list.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-2xl rounded-lg overflow-hidden hover:shadow-2xl transition cursor-pointer flex flex-col"
            >
              {/* Product Image */}
              <div
                onClick={() => handleClick(product._id)}
                className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={product.imageURL[0]}
                  alt={product.name}
                  className="object-contain h-full w-full p-2"
                />
              </div>

              {/* Product Details */}
              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <h3
                    onClick={() => handleClick(product._id)}
                    className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition"
                  >
                    {product.name}
                  </h3>
                  <p className="text-gray-500 mt-0.5 text-sm">Category: {product.category}</p>
                  <p className="text-gray-800 mt-1 font-semibold">${product.price}</p>
                </div>

                {/* Buttons */}
                <div className="mt-2 flex gap-1">
                  <button
                    onClick={() => handleClick(product._id)}
                    className="flex-1 px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => addCart(product._id)}
                    className="flex-1 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm"
                  >
                    Add to Cart
                  </button>
                </div>
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
