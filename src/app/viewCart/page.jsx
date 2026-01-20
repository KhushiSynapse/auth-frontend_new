"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Components/Navbar";

export default function ViewCart() {
  const [list, setList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const getCartItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/list-items",
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
          setList(data);
        } else if (response.status === 401) {
          alert("Token expired");
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          const data = await response.json();
          alert(data.message);
          router.push("/landing");
        }
      } catch (error) {
        alert(error.message);
      }
    };
    getCartItem();
  }, []);

  const updateQuantity = async (id, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/update-quantity/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ Quantity: newQuantity }),
        }
      );

      if (response.ok) {
        setList((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, Quantity: newQuantity } : item
          )
        );
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const incQuantity = (id, currentQuantity) =>
    updateQuantity(id, currentQuantity + 1);
  const decQuantity = (id, currentQuantity) =>
    updateQuantity(id, Math.max(currentQuantity - 1, 1));

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/remove-item/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setList(list.filter((item) => item._id !== id));
        const data = await response.json();
        alert(data.message);
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const totalPrice = list.reduce(
    (sum, product) => sum + Number(product.price) * product.Quantity,
    0
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-blue-50 py-4 sm:py-6">
  {/* Page Header */}
  <div className="max-w-7xl mx-auto flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-6 lg:px-8">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Cart</h2>
    <button
      onClick={() => router.push("/landing")}
      className="text-red-600 text-xl sm:text-2xl font-bold hover:text-red-800 transition"
    >
      ✖
    </button>
  </div>

  {/* Cart Items */}
  <div className="max-w-7xl mx-auto space-y-4 px-4 sm:px-6 lg:px-8">
    {list.map((product) => (
      <div
        key={product._id}
        className="flex flex-col sm:flex-row bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
      >
        {/* Product Image */}
        <div className="w-full sm:w-36 h-40 sm:h-48 bg-blue-100 flex items-center justify-center">
          <img
            src={product.imageURL[0]}
            alt={product.name}
            className="object-contain h-32 sm:h-40 w-32 sm:w-40 p-2 cursor-pointer"
            onClick={() => router.push(`/product/${product.productID}`)}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <h3
              className="text-lg sm:text-xl font-semibold text-gray-800 hover:text-blue-600 transition cursor-pointer"
              onClick={() => router.push(`/product/${product.productID}`)}
            >
              {product.name}
            </h3>
            <p className="text-gray-700 text-sm sm:text-base mt-2 font-medium">
              Price: ${product.price}
            </p>
            <p className="text-gray-700 text-sm sm:text-base mt-1 font-medium">
              Total Price: ${Number(product.price) * product.Quantity}
            </p>
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => decQuantity(product._id, product.Quantity)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full hover:bg-blue-300 transition font-bold text-lg"
              >
                −
              </button>
              <span className="px-3 py-1 border rounded-md font-semibold text-gray-800 text-sm sm:text-base">
                {product.Quantity}
              </span>
              <button
                onClick={() => incQuantity(product._id, product.Quantity)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full hover:bg-blue-300 transition font-bold text-lg"
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(product._id)}
              className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition text-sm sm:text-base"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    ))}

    {/* Checkout Summary */}
    {list.length > 0 && (
      <div className="flex justify-center mt-6 px-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md w-full max-w-md text-center">
          <p className="text-base sm:text-lg font-semibold">
            Total Items: {list.length}
          </p>
          <p className="text-base sm:text-lg font-semibold mt-2">
            Total Price: ${totalPrice}
          </p>
          <button
            onClick={() => router.push("/checkout")}
className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-base sm:text-lg mx-auto block"
          >
            Checkout
          </button>
        </div>
      </div>
    )}
  </div>
</div>

    </>
  );
}
