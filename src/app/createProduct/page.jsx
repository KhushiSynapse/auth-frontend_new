"use client"
import React, { useState,useRef } from "react";
import Navbar from "../Components/Navbar";

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: []
  });
  const fileInputRef=useRef(null)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = new FormData();
  data.append("name", formData.name);
  data.append("category", formData.category);
  data.append("price", formData.price);
  data.append("description", formData.description);
  formData.image.forEach((file)=>
  data.append("image", file));
  const token=localStorage.getItem("token")
   const response=await fetch("https://auth-backend-c94t.onrender.com/api/auth/add-product",{
    method:"POST",
    headers:{
      "Authorization":`Bearer ${token}`,
    },
    body:data
   })
   if(response.ok){
    const data=await response.json()
    setFormData({name: "",
    category: "",
    price: "",
    description: "",
    image: null})
    if (fileInputRef.current) {
  fileInputRef.current.value = "";  
}
    alert(data.message)
   }else if(response.status===401){
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        }
   else{
    const data=await response.json()
    alert(data.message)
   }
  };

  return (
    <>
    <Navbar/>
   
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Add a Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              required
            />
          </div>

          {/* Product Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Category<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Price<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 resize-none"
              rows={3}
              required
            />
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Upload Product Image<span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              ref={fileInputRef}
              className="w-full text-gray-600"
              required
              multiple
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
     </>
  );
}
