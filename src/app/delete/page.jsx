"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {useLang} from "../../context/LanguageContext"


export default function Delete() {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const {t,lang}=useLang()

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
              "Accept-Language":lang
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          const data = await response.json();
          alert(data.message);
          router.push("/landing");
        }
      } catch (error) {
        alert(error.message);
      }
    };

    getUsers();
  }, []);

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/delete-user/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language":lang
          },
        }
      );

      if (response.ok) {
        const data=await response.json()
        alert(data.message);
        setUsers(users.filter((user) => user._id !== id));
      } else if(response.status===401){
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        }else {
                const data=await response.json()
        alert(data.message);
        router.push("/landing");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-grey-50 flex justify-center p-4">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {t.All} {t.User}
        </h2>

        {/* Users List */}
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow"
            >
              {/* User Info */}
              <div className="flex flex-wrap md:flex-nowrap gap-6 w-full">
                <p className="w-full md:w-auto font-medium">
                  {user.firstname}
                </p>
                <p className="w-full md:w-auto font-medium">
                  {user.lastname}
                </p>
                <p className="w-full md:w-auto text-gray-600 break-all">
                  {user.email}
                </p>
                <p className="w-full md:w-auto text-blue-600 font-semibold">
                  {user.role.name}
                </p>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-500 text-black px-4 py-2 rounded hover:bg-red-600 transition whitespace-nowrap"
              >
                delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
