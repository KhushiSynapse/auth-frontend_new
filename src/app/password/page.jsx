"use client"

import React, { useState } from "react";
import { useLang } from "../../context/LanguageContext";
import { useRouter } from "next/navigation";
import Navbar from "../Components/Navbar";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
    cpassword: "",
  });

  const { t, lang } = useLang();
  const router = useRouter();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const changePass = async () => {
    if(!formData.oldpassword||!formData.newpassword||!formData.cpassword){
      alert("Empty Fields")
      return
    }
    if (formData.newpassword !== formData.cpassword) {
      alert("Password Mismatch");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://auth-backend-c94t.onrender.com/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": lang,
          },
          body: JSON.stringify({
            oldPassword: formData.oldpassword,
            newPassword: formData.newpassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password changed successfully!");
      } else if (response.status === 401) {
        alert("Token expired");
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        const data = await response.json();
        alert(data.message || "Error changing password");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
        {/* Card Container */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">
          {/* Close Button */}
         

          {/* Page Header */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            {t.ChangePassword}
          </h2>

          {/* Old Password */}
          {/* Old Password */}
<div className="mb-4">
  <label className="block mb-2 font-medium">
    {t.OldPassword} <span className="text-red-500">*</span>
  </label>

  {/* Input and button container */}
  <div className="flex items-center border border-gray-300  rounded-lg focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 overflow-hidden h-12">
    <input
      type={showOld ? "text" : "password"}
      name="oldpassword"
      placeholder="Enter old password"
      value={formData.oldpassword}
      onChange={handleChange}
      className="flex-1 px-3 py-2 focus:outline-none"
      required
    />
    <button
      type="button"
      className="px-3 text-gray-600 cursor-pointer "
      onClick={() => setShowOld(!showOld)}
    >
      {showOld ? "🙈" : "👁️"}
    </button>
  </div>
</div>


          {/* New Password */}
          <div className="mb-4">
  <label className="block mb-2 font-medium">
    {t.NewPassword} <span className="text-red-500">*</span>
  </label>

  {/* Input and button container */}
  <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 overflow-hidden h-12">
    <input
      type={showNew ? "text" : "password"}
      name="newpassword"
      placeholder="Enter new password"
      value={formData.newpassword}
      onChange={handleChange}
      className="flex-1 px-3 py-2 focus:outline-none "
      minLength={8}
      maxLength={16}
      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%&*]).*$"
      required
    />
    <button
      type="button"
      className="px-3 text-gray-600 cursor-pointer"
      onClick={() => setShowNew(!showNew)}
    >
      {showNew ? "🙈" : "👁️"}
    </button>
  </div>

  <p className="text-green-600 text-sm mt-1">{t.passwordsuggestion}</p>
</div>


          {/* Confirm Password */}
<div className="mb-6">
  <label className="block mb-2 font-medium">
    {t.ConfirmPassword} <span className="text-red-500">*</span>
  </label>

  {/* Input and button container */}
  <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 overflow-hidden h-12">
    <input
      type={showConfirm ? "text" : "password"}
      name="cpassword"
      placeholder="Retype new password"
      value={formData.cpassword}
      onChange={handleChange}
      className="flex-1 px-3 py-2 focus:outline-none "
      required
    />
    <button
      type="button"
      className="px-3 text-gray-600 cursor-pointer"
      onClick={() => setShowConfirm(!showConfirm)}
    >
      {showConfirm ? "🙈" : "👁️"}
    </button>
  </div>
</div>


          {/* Submit Button */}
          <button
            onClick={changePass}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {t.ChangePassword}
          </button>
        </div>
      </div>
    </>
  );
}
