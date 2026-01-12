"use client"

import React, { useState, useEffect } from "react"
import { useRouter,useParams } from "next/navigation"
export default function ViewProfile() {
  const router=useRouter()
  const [profile, setProfile] = useState(null)
  const{id}=useParams()
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch(`https://auth-backend-c94t.onrender.com/api/auth/get-userprofile/${id}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            
          },
        })
       const data = await response.json()
        if (response.ok) {
          setProfile(data)
        } else if(response.status===401){
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        }else {
          alert(data.message)
          router.push("/landing")
        }
      } catch (err) {
        
        alert(err.message)
      }
    }

    fetchProfile()
  }, [])

  if (!profile) return <h1 className="text-center mt-20 text-xl font-semibold">Loading...</h1>

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
         User Details
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between bg-gray-100 px-4 py-2 rounded">
            <span className="font-medium text-gray-700">FirstName:</span>
            <span className="text-gray-900">{profile.firstname}</span>
          </div>

          <div className="flex justify-between bg-gray-100 px-4 py-2 rounded">
            <span className="font-medium text-gray-700">LastName:</span>
            <span className="text-gray-900">{profile.lastname}</span>
          </div>

          <div className="flex justify-between bg-gray-100 px-4 py-2 rounded">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-900">{profile.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
