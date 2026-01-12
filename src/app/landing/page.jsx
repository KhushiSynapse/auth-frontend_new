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

  const roleLinks = {
    admin: [
      { href: "/profile", label: t.ViewProfile },
      { href: "/create", label: t.CreateProfile },
      { href: "/delete", label: t.DeleteProfile },
      { href: "/list", label: t.ListUsers },
      { href: "/assign", label: t.AssignRoles },
      { href: "/createProduct", label: t.AddProduct },
      { href: "/listProduct", label: t.ViewProduct },
      { href: "/viewCart", label: "View Cart" },
      { href: "/orderlog", label: "View Order Log" },
      { href: "/approveRefund", label: "Approve Refund" },
      { href: "/password", label: t.ChangePassword },
    ],
    manager: [
      { href: "/profile", label: t.ViewProfile },
      { href: "/list", label: t.ListUsers },
      { href: "/createProduct", label: t.AddProduct },
      { href: "/listProduct", label: t.ViewProduct },
      { href: "/viewCart", label: "View Cart" },
      { href: "/orders", label: "View OrderedItems" },
      { href: "/transaction", label: "View Transaction History" },
      { href: "/password", label: t.ChangePassword },
    ],
    user: [
      { href: "/profile", label: t.ViewProfile },
      { href: "/listProduct", label: t.ViewProduct },
      { href: "/viewCart", label: "View Cart" },
      { href: "/orders", label: "View OrderedItems" },
      { href: "/transaction", label: "View Transaction History" },
      { href: "/password", label: t.ChangePassword },
    ],
  };

  return (
    <div dir={dir} className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand */}
            <div className="text-xl font-bold text-gray-800">{t.MyApp}</div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {roleLinks[role].map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 transition"
              >
                {t.Logout}
              </button>

              {/* Language Selector */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="ml-2 w-32 px-2 py-1 border border-gray-400 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1"
              >
                {/* Hamburger icon */}
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
          <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow-md">
            {roleLinks[role].map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="block text-gray-700 hover:text-blue-600 transition"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="block text-gray-700 hover:text-red-600 transition w-full text-left"
            >
              {t.Logout}
            </button>

            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="w-full px-2 py-1 border border-gray-400 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t.Hello} {role} 👋
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">{t.dashboardWelcome}</p>
        </div>
      </main>
    </div>
  );
}
