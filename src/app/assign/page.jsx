"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "../../context/LanguageContext";
import Navbar from "../Components/Navbar";

export default function AssignRole() {
  const [newUsers, setNewUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();
  const { t, lang } = useLang();
  const [loading,setLoading]=useState(true)

  // Fetch new users
  useEffect(() => {
    const getNewUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/new-users",
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
          setNewUsers(data);
          setLoading(false)
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
    getNewUser();
  }, [lang, router]);

  // Set selected role and user id
  const handleSelect = (role, id) => {
    setSelectedRole(role);
    setSelectedUserId(id);
  };

  // Assign role
  const handleChange = async () => {
    if (!selectedRole || !selectedUserId) {
      alert("Please select a role first!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/assign-role/${selectedRole}/${selectedUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": lang,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // Remove assigned user from the list
        setNewUsers(newUsers.filter((user) => user._id !== selectedUserId));
        // Reset selection
        setSelectedRole("");
        setSelectedUserId("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };
{if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
        Loading.....
      </h2>
    </div>
  );
}}
  return (
    <>
    <Navbar/>
  
    <div className="min-h-screen p-4 max-w-7xl mx-auto bg-gray-100">
      <h2 className="text-2xl font-bold mb-6">{t.New} {t.User}</h2>

      {newUsers.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg font-medium">No new users</p>
        </div>
      ) : (
        <div className="space-y-4">
          {newUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white shadow-2xl rounded-xl p-4 md:flex md:items-center md:gap-4 transition "
            >
              {/* Name */}
              <div className="md:w-1/5 font-medium text-gray-800">
                {user.firstname} {user.lastname}
              </div>

              {/* Email */}
              <div className="md:w-1/3 text-gray-600 break-all">{user.email}</div>

              {/* Current Role */}
              <div className="md:w-1/5 text-gray-600">{user.role?.name || "User"}</div>

              {/* Role Select */}
              <div className="md:w-1/5 mt-2 md:mt-0">
                <select
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedUserId === user._id ? selectedRole : ""}
                  onChange={(e) => handleSelect(e.target.value, user._id)}
                >
                  <option value="" disabled>Select role</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Assign Button */}
              <div className="md:w-1/6 mt-2 md:mt-0">
                <button
                  onClick={handleChange}
                  className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Reviewed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
      </>
  );
}
