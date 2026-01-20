"use client"

import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navbar from "../../Components/Navbar"

export default function ProductDetails() {
  const [product, setProduct] = useState(null)
  const { id } = useParams()
  const router = useRouter()

  const addCart = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("You need to login first")
        router.push("/login")
        return
      }
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/save-product/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-store",
            Pragma: "no-cache",
          },
          cache: "no-store",
        }
      )
      const data = await response.json()
      alert(data.message)
    } catch (error) {
      alert(error.message)
    }
  }

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(
          `https://auth-backend-c94t.onrender.com/api/auth/get-ProductData/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
            cache: "no-store",
          }
        )
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else if (response.status === 401) {
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
  }, [id, router])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading product...</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* LEFT COLUMN: Swiper + Buttons */}
            <div className="flex justify-center w-full">
              <div className="w-full md:max-w-[500px]">
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={10}
                  slidesPerView={1}
                  navigation   // ✅ use Swiper’s built-in navigation
                  className="relative rounded-sm overflow-hidden
                  /* Default size (small screens) */
    [&_.swiper-button-prev]:w-6 [&_.swiper-button-prev]:h-6
    [&_.swiper-button-next]:w-6 [&_.swiper-button-next]:h-6

    /* Larger size on medium+ screens */
    sm:[&_.swiper-button-prev]:w-10 sm:[&_.swiper-button-prev]:h-10
    sm:[&_.swiper-button-next]:w-10 sm:[&_.swiper-button-next]:h-10
    [&_.swiper-button-prev]:left-[-2.5rem]   /* push prev button further left */
    [&_.swiper-button-next]:right-[-2.5rem]  /* push next button further right */
    sm:[&_.swiper-button-prev]:left-[-3rem]
    sm:[&_.swiper-button-next]:right-[-3rem]
    "
                >
                  {(product.imageURL?.length ? product.imageURL : ["/placeholder.png"]).map((image, i) => (
                    <SwiperSlide key={i}>
                      <div className="relative w-full aspect-[4/3] bg-gray-50">
                        <Image
                          src={image}
                          alt={product.name || "Product"}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

               
              </div>
            </div>

            {/* RIGHT COLUMN: Product Info */}
            <div className="flex flex-col justify-between">

              {/* Product Details */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>

                <p className="text-gray-500 text-sm md:text-base">
                  Category: <span className="font-medium">{product.category}</span>
                </p>

                <p className="text-3xl font-semibold text-blue-600">
                  ${product.price}
                </p>

                {/* Description */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Product Description
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {product.desc
                      ?.split(",")
                      .map((point) => point.trim())
                      .filter(Boolean)
                      .map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => addCart(product._id)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() =>
                    router.push(
                      `/buyCheckout?name=${encodeURIComponent(product.name)}&price=${product.price}`
                    )
                  }
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Buy Now
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
