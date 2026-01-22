"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "../../context/LanguageContext";
import {jwtDecode} from "jwt-decode";

export default function Landing() {
  const router = useRouter();
  const { t, setLang, dir, lang } = useLang();
  const [role, setRole] = useState("user");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoder = jwtDecode(token);
      setRole(decoder.rolename);
    }
  }, []);

  if (!lang) return null;
  

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

  // Define cards based on role
  const roleCards = {
   
    manager: [
      { href: "/profile", label: t.ViewProfile, icon: "👤" },
      { href: "/list", label: t.ListUsers, icon: "📋" },
      { href: "/createProduct", label: t.AddProduct, icon: "🛍️" },
      
      { href: "/password", label: t.ChangePassword, icon: "🔑" },
    ],
    user: [
      { href: "/profile", label: t.ViewProfile, icon: "👤" },
      { href: "/listProduct", label: t.ViewProduct, icon: "📦" },
      { href: "/viewCart", label: "View Cart", icon: "🛒" },
      { href: "/orders", label: "View OrderedItems", icon: "📦" },
      { href: "/transaction", label: "View Transaction History", icon: "💳" },
      { href: "/password", label: t.ChangePassword, icon: "🔑" },
    ],
  };

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
     <nav className="bg-blue-600 shadow-md">
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
          {/* Hamburger Icon */}
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


      {/* Dashboard Cards */}
   <main className="flex-grow py-10 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {t.Hello} {role} 👋
        </h2>
        <p className="text-gray-600 mb-8">{t.dashboardWelcome}</p>

        <div className="w-full px-4 md:px-8 lg:px-12">
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {roleCards[role]?.map((card, idx) => (
      <Link
        key={idx}
        href={card.href}
        className="relative group bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-2xl overflow-hidden
                   p-6 flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
      >
        {/* Icon Circle */}
        <div className="w-20 h-20 mb-4 rounded-full bg-white flex items-center justify-center text-4xl shadow-md transition-transform duration-300 group-hover:scale-110">
          {card.icon}
        </div>
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800">{card.label}</h3>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-300 to-transparent opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl"></div>
      </Link>
    ))}
  </div>
</div>



      </main>
    </div>
  );
}
