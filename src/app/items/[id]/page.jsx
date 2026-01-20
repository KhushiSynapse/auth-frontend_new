"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../Components/Navbar"; // Adjust path as needed

export default function Transaction() {
  const [list, setList] = useState([]);
  const { id } = useParams();
  const router = useRouter();
  const [loading,setLoading]=useState(true)

  useEffect(() => {
    const getItemDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `https://auth-backend-c94t.onrender.com/api/auth/get-productdetails/${id}`,
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
          alert("Error fetching details");
        }
      } catch (error) {
        alert(error.message);
      }
    };

    getItemDetails();
  }, [id]);
 
{if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
        Loading.....
      </h2>
    </div>
  );
}}
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-6">
        {/* Header */}
        <div className="relative w-full mb-6">
          {/* Centered Title */}
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Ordered Items
          </h2>

          {/* Close Button */}
          <button
            onClick={() => router.back()}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center  text-white h transition"
            aria-label="Close"
            title="Close"
          >
            ✖
          </button>
        </div>

        {/* Products Container */}
        <div className="max-w-4xl mx-auto space-y-6">
          {list.length === 0 ? (
            <h2 className="text-center text-gray-500">
             No items found
            </h2>
          ) : (
            list.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-xl border border-gray-300 p-6 flex flex-col md:flex-row items-center gap-6"
              >
                {/* Product Image */}
                {item.imageURL && item.imageURL.length > 0 && (
                  <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={item.imageURL[0]}
                      alt={item.name}
                      className="object-contain h-full w-full p-2"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="flex-1 text-center md:text-left flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-gray-700 mt-2 text-lg">
                      Price: <span className="font-medium">${item.price}</span>
                    </p>
                    <p className="text-gray-700 mt-1 text-lg">
                      Quantity: <span className="font-medium">{item.Quantity}</span>
                    </p>
                  </div>
                  <p className="text-gray-900 mt-3 text-lg font-semibold  text-center md:text-right">
                    Total: ${item.price * item.Quantity}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
