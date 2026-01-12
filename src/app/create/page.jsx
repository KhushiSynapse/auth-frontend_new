"use client"

import React, { useState } from "react";
import {useRouter} from "next/navigation"
import {useLang} from "../../context/LanguageContext"
export default function CreateUser() {
    const router=useRouter()
    const{t,lang}=useLang()
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createuser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://auth-backend-c94t.onrender.com/api/auth/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language":lang
          },
          body: JSON.stringify({firstname:formData.firstname,lastname:formData.lastname,email:formData.email,password:formData.password}),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFormData({
            firstname:"",
            lastname:"",
            email:"",
            password:""
        })
       
        alert(data.message);
        
      }else if(response.status===401){
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        } else {
        alert(data.message);
        router.push("/landing")
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
   <div className="flex items-start justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">{t.Create} {t.User}</h1>

        {/* First Name */}
        <label className="block mb-2 font-medium">
          {t.FirstName} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="firstname"
          placeholder="Enter your first name"
          value={formData.firstname}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Last Name */}
        <label className="block mb-2 font-medium">
          {t.LastName} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="lastname"
          placeholder="Enter your last name"
          value={formData.lastname}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Email */}
        <label className="block mb-2 font-medium">
          {t.Email} <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Password */}
        <label className="block mb-2 font-medium">
          {t.Password} <span className="text-red-500">*</span>
        </label>
        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            name="password"
            minLength="8"
            maxLength="16"
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%&*]).*$"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-600"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? "🙈" : "👁️"}
          </button>
        </div>
        <p className="text-green-600 text-sm mb-4">
{t.passwordsuggestion}        </p>

        {/* Create Button */}
        <button
          onClick={createuser}
          className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          {t.Create}
        </button>
      </div>
    </div>
    </>
  );
}
