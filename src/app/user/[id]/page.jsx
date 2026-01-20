"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLang } from "../../../context/LanguageContext"
import defaultAvatar from "../../../../public/profile.jpg"
import Navbar from "@/app/Components/Navbar"

export default function ViewProfile() {
  const router = useRouter()
  const { id } = useParams()
  const { t, lang, dir, setLang } = useLang()
  const [profileData, setProfileData] = useState(null)
  
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch(
          `https://auth-backend-c94t.onrender.com/api/auth/get-userprofile/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "Accept-Language": lang,
            },
          }
        )
        const data = await response.json()
        if (response.ok) {
          setProfileData(data)
        } 
         else {
          alert(data.message)
          router.push("/landing")
        }
      } catch (err) {
        alert(err.message)
      }
    }

    fetchProfile()
  }, [lang, id])

    {if (!profileData) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
        Loading.....
      </h2>
    </div>
  );
}}

  return (
    <><Navbar/>
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      

      {/* Profile Card */}
      <div className="flex items-center justify-center flex-grow px-4 py-10">
        <div className="relative bg-white shadow-xl rounded-xl max-w-lg w-full">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 flex flex-col items-center justify-center py-10 relative rounded-t-xl">
            <img
              className="w-24 h-24 rounded-full border-4 border-white"
              src={profileData.avatar || defaultAvatar.src}
              alt="Profile Avatar"
            />
            <h2 className="mt-4 text-2xl font-bold text-white">{profileData.firstname} {profileData.lastname}</h2>
            <h2 className="mt-4 text-2xl font-bold text-white">{profileData._id} </h2>

            {/* Close Button */}
            <button
              onClick={() => router.back()}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:opacity-80 transition"
            >
              ✖
            </button>
          </div>

          {/* Info Section */}
          <div className="p-6 space-y-4">
            <h3 className="text-gray-800 font-semibold text-lg border-b pb-2">{t.Profile}</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded shadow-sm">
                <span className="text-gray-600 font-medium">{t.FirstName}:</span>
                <span className="text-gray-800">{profileData.firstname}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded shadow-sm">
                <span className="text-gray-600 font-medium">{t.LastName}:</span>
                <span className="text-gray-800">{profileData.lastname}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded shadow-sm">
                <span className="text-gray-600 font-medium">{t.Email}:</span>
                <span className="text-gray-800">{profileData.email}</span>
              </div>
            </div>

           
            
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
