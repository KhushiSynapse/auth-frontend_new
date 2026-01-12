"use client"

import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function ProductDetails() {
  const [product, setProduct] = useState({ imageURL: [] })
  const { id } = useParams()
  const router = useRouter()

  const addCart = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://auth-backend-c94t.onrender.com/api/auth/save-product/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      alert(data.message)
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(`https://auth-backend-c94t.onrender.com/api/auth/get-ProductData/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        }else if(response.status===401){
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        } else {
          const data = await response.json()
          alert(data.message)
        }
      } catch (error) {
        alert(error.message)
      }
    }
    getProduct()
  }, [])

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6 md:space-y-8">
      
      {/* Product Image */}
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="rounded-lg"
        >
          {product.imageURL.map((image, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px]">
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </SwiperSlide>
          ))}

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev absolute left-[-30px] top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition">
            ‹
          </div>
          <div className="swiper-button-next absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition">
            ›
          </div>
        </Swiper>
      </div>

      {/* Product Details */}
      <div className="text-center md:text-left space-y-3 md:space-y-4">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h3>
        <p className="text-gray-600 md:text-lg">Category: {product.category}</p>
        <p className="text-2xl md:text-3xl font-semibold text-green-600">${product.price}</p>
        <div>
  <h3 className="text-xl font-semibold">Description:</h3>
  <ul className="list-disc list-inside text-gray-700 mt-2">
    {product.desc?.split(",").map((point, index) => (
      <li key={index}>{point}</li>
    ))}
  </ul>
</div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center md:justify-start">
        <button
          onClick={() => addCart(product._id)}
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition w-full md:w-auto"
        >
          Add to Cart
        </button>
        <button
          onClick={() => router.push(`/buyCheckout?name=${encodeURIComponent(product.name)}&price=${product.price}`)}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition w-full md:w-auto"
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}
