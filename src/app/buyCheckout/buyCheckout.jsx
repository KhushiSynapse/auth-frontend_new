"use client"

import React, { useState ,useEffect} from "react"
import { useSearchParams } from "next/navigation"

export default function BuyCheckout() {
  const searchParams = useSearchParams()
  const name = searchParams.get("name")
  const price = searchParams.get("price")
  const[mounted,setMounted]=useState(false)
  const [quantity, setQuantity] = useState(1)
 useEffect(() => {
    const saved = localStorage.getItem("Quantity");
    if (saved) setQuantity(Number(saved));
    setMounted(true);
  }, []);
 

const handlePay=()=>{
  localStorage.removeItem("Quantity")
  setQuantity(1)
}

useEffect(() => {
    if(mounted) localStorage.setItem("Quantity",quantity)
  }, [mounted,quantity]);
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 flex flex-col gap-8">

      {/* Order Preview */}
      <div className="max-w-4xl w-full mx-auto bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center md:text-left">
          Order Preview
        </h2>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-gray-700 space-y-1">
            <p className="font-medium text-lg">Product: {name}</p>
            <p>Price: ${price}</p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(prev=>Math.max(prev- 1, 1))}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
            >
              −
            </button>

            <span className="px-4 py-1 border rounded-md font-semibold text-gray-800">
              {quantity}
            </span>

            <button
              onClick={() => setQuantity(prev=>prev+ 1)}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="max-w-4xl w-full mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center md:text-left mb-4">
          Order Summary
        </h2>

        {/* Table Header (Desktop only) */}
        <div className="hidden md:grid grid-cols-4 gap-4 border-b pb-2 font-semibold text-gray-600">
          <p>Product Name</p>
          <p className="text-center">Price</p>
          <p className="text-center">Quantity</p>
          <p className="text-right">Total Price</p>
        </div>

        {/* Product Row */}
        <div
          className=" border-b py-4 text-gray-700 flex flex-col gap-2 md:grid md:grid-cols-4 md:gap-4 md:items-center"
        >
          {/* Product Name */}
          <div className="font-medium text-gray-800">
            {name}
          </div>

          {/* Price */}
          <div className="flex justify-between md:justify-center">
            <span className="md:hidden font-medium">Price</span>
            <span>${price}</span>
          </div>

          {/* Quantity */}
          <div className="flex justify-between md:justify-center">
            <span className="md:hidden font-medium">Quantity</span>
            <span>{quantity}</span>
          </div>

          {/* Total */}
          <div className="flex justify-between md:justify-end font-semibold text-gray-900">
            <span className="md:hidden">Total</span>
            <span>${Number(price) * quantity}</span>
          </div>
        </div>

        {/* Total Section */}
        <div className="mt-6 flex flex-col items-center md:items-end gap-2">
          <p className="text-lg font-semibold text-gray-800">
            Total Items: 1
          </p>
          <p className="text-xl font-bold text-gray-900">
            Total Price: ${Number(price) * quantity}
          </p>

          <button onClick={()=>handlePay()} className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Pay
          </button>
        </div>
      </div>
    </div>
  )
}
