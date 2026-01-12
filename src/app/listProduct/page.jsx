"use client"

import React, { useState, useEffect } from "react";
import {useRouter} from "next/navigation"
import {socket} from "../socket/page"

export default function ListProduct() {
  const [list, setList] = useState([]);
  const router=useRouter()
  
const addCart=async(productId)=>{
  try{
      const token = localStorage.getItem("token");
    const response=await fetch(`https://auth-backend-c94t.onrender.com/api/auth/save-product/${productId}`,{
      method:"POST",
      headers:{"Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      },
     
    })
    if(response.ok){
      const data=await response.json()
      alert(data.message)
    }
    else{
      const data=await response.json()
      alert(data.message)
    }
  }
  catch(error){
    alert(error.message)
  }
}

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/list-products",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
           
       
        if (response.ok) {
          const data = await response.json();
          setList(data);
        } else if(response.status===401){
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        }else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        alert(error.message);
      }
    };
    getAllProducts();

    socket.connect()
    const handleList = (newProduct) => {
    setList(prev => {
      if (prev.some(p => p._id === newProduct._id)) return prev;
      return [newProduct, ...prev];
    });
  };
    socket.on("product:added",handleList)
    return () => {
      socket.off("product:added",handleList);
      socket.disconnect();
    }
   
  }, []);

  const handleClick=(id)=>{
    router.push(`/product/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="relative flex items-center justify-center mb-8">
    {/* Centered Heading */}
    <h2 className="text-3xl font-bold text-gray-800">
      All Products
    </h2>

    {/* X Button at Right */}
    <button onClick={()=>router.push("/landing")} className="absolute right-0 text-red-600 text-2xl font-bold hover:text-red-800 transition">
      ✖
    </button>
  </div>


      <div className="max-w-5xl mx-auto space-y-6">
        {list.map((product) => (
          <div
            key={product._id}
           
            className="bg-white shadow-md rounded-lg flex flex-col md:flex-row items-center md:items-start p-6 space-y-4 md:space-y-0 md:space-x-6"
          >
            {/* Product Image */}
            <img
              src={product.imageURL[0]}
              alt={product.name}
              className="w-full md:w-40 h-40 object-contain rounded-lg"
            />

            {/* Product Details */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-gray-600 mt-1">
                Category: {product.category}
              </p>
              <p className="text-gray-600 mt-1">
                Price: ${product.price}
              </p>
             
             
              {/* Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button  onClick={()=>handleClick(product._id)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  View Product
                </button>
                <button onClick={()=>addCart(product._id)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
