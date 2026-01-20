"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "../../context/LanguageContext";
import Navbar from "../Components/Navbar";

export default function Delete() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLang();
  const router = useRouter();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/list-users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "Accept-Language": lang,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else if (response.status === 401) {
          alert("Token expired");
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          const data = await response.json();
          alert(data.message);
          router.push("/landing");
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [lang, router]);

  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/delete-user/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": lang,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setUsers(users.filter((user) => user._id !== id));
      } else if (response.status === 401) {
        alert("Token expired");
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        const data = await response.json();
        alert(data.message);
        router.push("/landing");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
          Loading.....
        </h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="flex justify-center items-start min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-4xl space-y-6">

          
          <div className="flex items-center justify-between mb-4">
            {/* Left spacer */}
            <div className="w-10" />

            {/* Centered Heading */}
            <h2 className="text-2xl font-bold text-center flex-1">
              {t.All} {t.User}
            </h2>

            {/* Close Button */}
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center  bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-gray-600 text-xl font-bold transition"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* User Cards */}
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow-2xl transition p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex-1 space-y-1">
                <p className="text-lg font-semibold text-gray-800">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-gray-600">Role: {user.role.name}</p>
                <p className="text-gray-600 break-words">{user.email}</p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition mt-2 sm:mt-0 whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          ))}

          {users.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No users found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
