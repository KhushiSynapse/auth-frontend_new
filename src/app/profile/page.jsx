"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLang } from "../../context/LanguageContext"
import defaultAvatar from "../../../public/profile.jpg"

export default function ViewProfile() {
  const router = useRouter()
  const { t, lang, dir, setLang } = useLang()
  const [profileData, setProfileData] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [Loading,setLoading]=useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/view-profile",
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
          setLoading(false)
        } else if (response.status === 401) {
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        } else {
          alert(data.message)
          router.push("/landing")
        }
      } catch (err) {
        alert(err.message)
      }
    }

    fetchProfile()
  }, [lang])

  {if (Loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
        Loading.....
      </h2>
    </div>
  );
}
}

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-white">{t.MyApp}</div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  router.push("/login")
                }}
                className="text-white hover:text-red-300 transition"
              >
                {t.Logout}
              </button>

              {/* Language Selector */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="ml-2 w-32 px-2 py-1 border border-white rounded-md bg-blue-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="" disabled>
                  Select language
                </option>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="ar">Arabic</option>
                <option value="sp">Spanish</option>
              </select>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 p-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 bg-blue-600 shadow-md">
            <button
              onClick={() => {
                localStorage.removeItem("token")
                router.push("/login")
              }}
              className="block text-white hover:text-red-300 transition w-full text-left"
            >
              {t.Logout}
            </button>

            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-blue-100 text-gray-800 border border-blue-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-blue-200 w-full"
            >
              <option value="" disabled>
                Select language
              </option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
              <option value="sp">Spanish</option>
            </select>
          </div>
        )}
      </nav>

      {/* Profile Card */}
      <div className="flex items-center justify-center flex-grow px-4 py-10">
        <div className="relative bg-white shadow-xl rounded-xl max-w-lg w-full overflow-hidden">
          {/* Header with Avatar */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-10 flex flex-col items-center text-white relative">
            <img
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              src={profileData.avatar || defaultAvatar.src}
              alt="Profile Avatar"
            />
            <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl md:text-3xl font-bold break-all text-center sm:text-left">
  {profileData._id}
</h2>

<p className="mt-1 text-base sm:text-lg md:text-xl font-semibold text-gray-700 text-center sm:text-left">
  {profileData.role?.name || "User"}
</p>

            {/* Close Button */}
            <button
              onClick={() => router.push("/landing")}
              className="absolute top-4 right-4 text-white text-2xl hover:opacity-80 transition"
            >
              ✖
            </button>
          </div>

          {/* Info Section */}
          <div className="p-6 space-y-4">
            <h3 className="text-gray-800 font-semibold text-xl border-b pb-2">
              {t.Profile}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between p-4 bg-gray-50 rounded shadow-sm text-lg">
                <span className="text-gray-600 font-medium">{t.FirstName}:</span>
                <span className="text-gray-800">{profileData.firstname}</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded shadow-sm text-lg">
                <span className="text-gray-600 font-medium">{t.LastName}:</span>
                <span className="text-gray-800">{profileData.lastname}</span>
              </div>
              <div className="flex justify-between p-4 bg-gray-50 rounded shadow-sm text-lg">
                <span className="text-gray-600 font-medium">{t.Email}:</span>
                <span className="text-gray-800">{profileData.email}</span>
              </div>
            </div>

            {/* Change Password Button */}
            <div className="pt-4">
              <button
                onClick={() => router.push("/password")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition text-lg"
              >
                {t.ChangePassword}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
