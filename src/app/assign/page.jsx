"use client";

import React, { useState, useEffect } from "react";
import {useRouter} from "next/navigation"
import {useLang} from "../../context/LanguageContext"

export default function AssignRole() {
  const [newUsers, setNewUsers] = useState([]);
  const[id,setId]=useState("")
  const [value,setValue]=useState("")
  const router=useRouter()
  const {t,lang}=useLang()

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
              "Accept-Language":lang
            },
          }
        );
        if(response.ok){
        const data = await response.json();
        setNewUsers(data);}
        else if(response.status===401){
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        }
        else{
            const data = await response.json();
            alert (data.message)
            router.push("/landing")
        }
      } catch (error) {
        alert(error.message);
      }
    };
    getNewUser();
  }, []);

  const setValues=(value,id)=>{
    setId(id)
    setValue(value)

  }
  const handleChange = async (value, id) => {
    try {
        const token = localStorage.getItem("token");
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/assign-role/${value}/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language":lang
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setNewUsers(newUsers.filter((user)=>user._id!==id))
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">{t.New} {t.User}</h2>

      <div className="space-y-4">
        {newUsers.map((user) => (
          <div
            key={user._id}
            className="
              flex flex-col gap-3
              md:flex-row md:items-center md:gap-4
              bg-white shadow rounded-lg p-4
            "
          >
            {/* Name */}
            <div className="md:w-1/5 font-medium">
              {user.firstname} {user.lastname}
            </div>

            {/* Email */}
            <div className="md:w-1/3 text-gray-600 break-all">
              {user.email}
            </div>

             <div className="md:w-1/3 text-gray-600 break-all">
              {user.role.name}
            </div>

            {/* Role Select */}
            <div className="md:w-1/5">
              <select
                className="
                  w-full border rounded-md px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                onChange={(e) => setValues(e.target.value, user._id)}
                defaultValue=""
              >
                <option value="" disabled>
                  Select role
                </option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Button */}
            <div className="md:w-1/6">
              <button onClick={()=>handleChange(value,id)}
                className="
                  w-full md:w-auto
                  bg-blue-600 text-white px-6 py-2 rounded-md
                  hover:bg-blue-700 transition
                "
              >
                Reviewed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
