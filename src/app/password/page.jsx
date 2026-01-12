"use client"

import React, { useState } from "react";
import {useLang} from "../../context/LanguageContext"


export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
    cpassword: "",
  });
  const {t,lang}=useLang()

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const changePass = async () => {
    if (formData.newpassword !== formData.cpassword) {
      alert("Password Mismatch");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://auth-backend-c94t.onrender.com/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Accept-Language":lang
        },
        body: JSON.stringify({
          oldPassword: formData.oldpassword,
          newPassword: formData.newpassword,
        }),
      });

      if (response.ok) {
        alert("Password changed successfully!");
      } else if(response.status===401){
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        }else {
        const data = await response.json();
        alert(data.message || "Error changing password");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">{t.ChangePassword}</h2>

        {/* Old Password */}
        <div className="mb-4 relative">
          <label className="block mb-2 font-medium">{t.OldPassword} <span className="text-red-500">*</span></label>
          <input
            type={showOld ? "text" : "password"}
            name="oldpassword"
            placeholder="Enter old password"
            value={formData.oldpassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-2 top-9 text-gray-600"
            onClick={() => setShowOld(!showOld)}
          >
            {showOld ? "🙈" : "👁️"}
          </button>
        </div>

        {/* New Password */}
        <div className="mb-4 relative">
          <label className="block mb-2 font-medium">{t.NewPassword} <span className="text-red-500">*</span></label>
          <input
            type={showNew ? "text" : "password"}
            name="newpassword"
            placeholder="Enter new password"
            value={formData.newpassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded pr-10"
            minLength={8}
            maxLength={16}
            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%&*]).*$"
            required
          />
          <button
            type="button"
            className="absolute right-2 top-9 text-gray-600"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? "🙈" : "👁️"}
          </button>
          <p className="text-green-600 text-sm mt-1">
          {t.passwordsuggestion}         
           </p>
        </div>

        {/* Confirm Password */}
        <div className="mb-6 relative">
          <label className="block mb-2 font-medium">{t.ConfirmPassword} <span className="text-red-500">*</span></label>
          <input
            type={showConfirm ? "text" : "password"}
            name="cpassword"
            placeholder="Retype new password"
            value={formData.cpassword}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-2 top-9 text-gray-600"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          onClick={changePass}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition"
        >
          {t.ChangePassword}
        </button>
      </div>
    </div>
  );
}
