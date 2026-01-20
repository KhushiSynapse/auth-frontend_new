"use client";
import React, { useState } from "react";
import QR from "../ORCode/page";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    cpassword: "",
    generatePassword: false,
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showCPass, setShowCPass] = useState(false);
  const [qr, setQr] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const sendOtp = async () => {
    if (!formData.email) return alert("Enter your email");

    try {
      const response = await fetch(
        "https://auth-backend-c94t.onrender.com/api/auth/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );
      const data = await response.json();
      alert(data.message);
      if (response.ok) setOtpSent(true);
    } catch (error) {
      console.error(error);
      alert("Error sending OTP");
    }
  };

  const handleVerifyEmail = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const response = await fetch(
        "https://auth-backend-c94t.onrender.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp }),
        }
      );
      const data = await response.json();
      alert(data.message);
      if (response.ok) setEmailVerified(true);
    } catch (error) {
      console.error(error);
      alert("Error verifying OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setClicked(true);

    if (!emailVerified) {
      alert("Please verify your email before signing up");
      setClicked(false);
      return;
    }

    if (formData.password !== formData.cpassword) {
      alert("Passwords do not match");
      setClicked(false);
      return;
    }

    try {
      const response = await fetch(
        "https://auth-backend-c94t.onrender.com/api/auth/send-details",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setQr(data.qr);
        alert("Sign up successful (Now scan the code and login)");
      } else {
        alert("Sign-Up failed");
        setClicked(false);
      }
    } catch (error) {
      alert(error.message);
      setClicked(false);
    }
  };

  const generatePass = () => {
    const chars =
      "ABC234DEFGHIJKLMNOPQ@#RSTUefghijklVWXYYZabcdmnopqrstuvwxyz1567890!$%^&*()_-";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  return (
    <>
      {qr && <QR image={qr} />}
      {!qr && (
        <div className="flex items-center justify-center min-h-screen bg-blue-50 p-6">
         <form className="bg-white p-10 rounded-2xl shadow-2xl border-l-4 border-blue-500 w-full max-w-md space-y-5 hover:shadow-blue-400 transition-shadow duration-300">
  <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Sign Up</h2>

  {/* First Name */}
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-2">
      First Name <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      name="firstname"
      placeholder="Enter your first name"
      value={formData.firstname}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
      required
    />
  </div>

  {/* Last Name */}
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-2">
      Last Name <span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      name="lastname"
      placeholder="Enter your last name"
      value={formData.lastname}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
      required
    />
  </div>

  {/* Email */}
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-2">
      Email <span className="text-red-500">*</span>
    </label>
    <input
      type="email"
      name="email"
      placeholder="Enter your email"
      value={formData.email}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
      required
      disabled={emailVerified}
    />
    {!emailVerified && (
      <button
        type="button"
        onClick={sendOtp}
        className="w-full mt-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-lg hover:scale-105 transform transition"
      >
        Send OTP
      </button>
    )}
  </div>

  {/* OTP */}
  {otpSent && !emailVerified && (
    <div className="mb-4">
      <input
        type="number"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none mb-2"
      />
      <button
        type="button"
        onClick={handleVerifyEmail}
        className="w-full bg-green-500 text-white p-3 rounded-lg hover:scale-105 transform transition"
      >
        Verify Email
      </button>
    </div>
  )}

  {/* Generate Password */}
  <div className="mb-4">
    <label className="flex items-center font-medium text-gray-700 mb-2">
      <input
        type="checkbox"
        name="generatePassword"
        checked={formData.generatePassword}
        onChange={(e) => {
          const checked = e.target.checked;
          if (checked) {
            const newPass = generatePass();
            setFormData({
              ...formData,
              generatePassword: true,
              password: newPass,
              cpassword: newPass,
            });
          } else {
            setFormData({
              ...formData,
              generatePassword: false,
              password: "",
              cpassword: "",
            });
          }
        }}
        disabled={!emailVerified}
        className="mr-2"
      />
      Generate password for me
    </label>
  </div>

  {/* Password */}
  <div className="relative mb-4">
  <label className="block text-gray-700 font-medium mb-2">
    Password <span className="text-red-500">*</span>
  </label>

  <div className="relative">
    <input
      type={showPass ? "text" : "password"}
      name="password"
      minLength="8"
      maxLength="16"
      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%&*]).*$"
      placeholder="Enter your password"
      value={formData.password}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10"
      required={!formData.generatePassword}
      disabled={formData.generatePassword || !emailVerified}
    />
    <button
      type="button"
      className="absolute right-2 inset-y-0 flex items-center px-2 text-gray-600"
      onClick={() => setShowPass(!showPass)}
    >
      {showPass ? "🙈" : "👁️"}
    </button>
  </div>

  <p className="text-green-600 text-sm mt-1">
    Must contain 1 uppercase, 1 lowercase, 1 special character, min 8 chars
  </p>
</div>


  {/* Confirm Password */}
  <div className="relative mb-4">
  <label className="block text-gray-700 font-medium mb-2">
    Confirm Password <span className="text-red-500">*</span>
  </label>

  <div className="relative">
    <input
      type={showCPass ? "text" : "password"}
      name="cpassword"
      placeholder="Confirm your password"
      value={formData.cpassword}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none pr-10"
      required={!formData.generatePassword}
      disabled={formData.generatePassword || !emailVerified}
    />
    <button
      type="button"
      className="absolute right-2 inset-y-0 flex items-center px-2 text-gray-600"
      onClick={() => setShowCPass(!showCPass)}
    >
      {showCPass ? "🙈" : "👁️"}
    </button>
  </div>
</div>


  {/* Submit */}
  <button
    type="submit"
    disabled={clicked}
    className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-lg hover:scale-105 transform transition"
  >
    Sign Up
  </button>

  <p className="text-center text-gray-700 mt-4 text-base">
    Already have an account?
    <a
      href="/login"
      className="text-blue-800 font-semibold ml-1 hover:text-blue-900 hover:underline transition-colors duration-200"
    >
      Login
    </a>
  </p>
</form>

        </div>
      )}
    </>
  );
}
