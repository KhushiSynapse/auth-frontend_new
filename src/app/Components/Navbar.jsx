"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "../../context/LanguageContext";

export default function Navbar() {
  const router = useRouter();
  const { t, setLang, dir, lang } = useLang();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      setLang("en");
      localStorage.setItem("lang", "en");
      alert("Logging you out");
      router.push("/login");
    } else {
      setLang("en");
      localStorage.setItem("lang", "en");
      alert("You are not logged in");
      router.push("/login");
    }
  };

  return (
    <nav dir={dir} className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="text-xl font-bold text-white">{t.MyApp}</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleLogout}
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
            onClick={handleLogout}
            className="block text-white hover:text-red-300 transition w-full text-left"
          >
            {t.Logout}
          </button>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-blue-100 text-gray-800 border border-blue-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-blue-200"
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
  );
}
