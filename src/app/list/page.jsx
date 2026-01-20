"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "../../context/LanguageContext";
import Navbar from "../Components/Navbar";
import { useGetUserListQuery } from "./ListUsersApi";


export default function List() {
  
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLang();
  const router = useRouter();
  const {data:users=[],isLoading,error}=useGetUserListQuery()
  
 console.log(users)

  {if (isLoading) {
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
    <>
      <Navbar />
      <div className="flex justify-center items-start min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-5xl space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {t.All} {t.User}
          </h2>

          {/* User Cards - Horizontal row layout */}
          {users.map((user, index) => (
            <div
              key={user._id || index}
              className="bg-white rounded-lg shadow-2xl hover:shadow-2xl transition p-4 flex flex-row justify-between items-center gap-4 flex-wrap"
            >
              <p className="flex-1 font-medium text-gray-800">
                {user.firstname} {user.lastname}
              </p>
              <p className="flex-1 text-gray-600">{user.role.name}</p>
              <p className="flex-1 text-gray-600 break-words">{user.email}</p>
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
