"use client";
import React, { useState } from "react";
import QR from "../ORCode/page";
import {useRouter} from "next/navigation"
export default function SignUp() {
  const router= useRouter()
  // State
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    cpassword: "",
    generatePassword:false,
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [showPass,setShowPass]=useState("")
  const [showCPass,setShowCPass]=useState("")

  const [qr,setQr]=useState("")
  

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Send OTP
  const sendOtp = async () => {
    if (!formData.email) {
      return alert("Enter your email");
    }

    try {
      const response = await fetch(
        "https://auth-backend-c94t.onrender.com/api/auth/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error sending OTP");
    }
  };

  // Verify OTP
  const handleVerifyEmail = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const response = await fetch(
        "https://auth-backend-c94t.onrender.com/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setEmailVerified(true);
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error verifying OTP");
    }
  };

  // Form submit
  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!emailVerified) {
      return alert("Please verify your email before signing up");
    }

    if (formData.password !== formData.cpassword) {
      return alert("Passwords do not match");
    }
    const response= await fetch("https://auth-backend-c94t.onrender.com/api/auth/send-details",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({firstname:formData.firstname,lastname:formData.lastname,email:formData.email,password:formData.password})
    })
    const data=await response.json()
    setQr(data.qr)
    //data.qr code logic........to be written
    alert("Sign up successful (Now scan the code and login)");
    // TODO: Call backend signup API here
  };
const generatePass=()=>{
  const chars="ABC234DEFGHIJKLMNOPQ@#RSTUefghijklVWXYYZabcdmnopqrstuvwxyz1567890!$%^&*()_-"
  const length=8;
  let password=""
  for(let i=0;i<length;i++){
    password+=chars.charAt(Math.floor(Math.random()*chars.length))
  }
  return password;
}
  return (
    <>
    {qr && <QR image={qr}/>}
    {!qr&&<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* First Name */}
        <label className="block mb-2 font-medium">
          First Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="firstname"
          placeholder="Enter your first name"
          value={formData.firstname}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />

        {/* Last Name */}
        <label className="block mb-2 font-medium">
          Last Name<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="lastname"
          placeholder="Enter your last name"
          value={formData.lastname}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />

        {/* Email */}
        <label className="block mb-2 font-medium">
          Email<span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded"
          required
          disabled={emailVerified} // Disable after verification
        />
        {!emailVerified && (
          <button
            type="button"
            onClick={sendOtp}
            className="w-full mb-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Send OTP
          </button>
        )}

        {/* OTP Input */}
        {otpSent && !emailVerified && (
          <div className="mb-4">
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full mb-2 p-2 border border-gray-300 rounded"
            />
            <button
              type="button"
              onClick={handleVerifyEmail}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
            >
              Verify Email
            </button>
          </div>
        )}

<label className="block mb-2 font-medium">
  <input
    type="checkbox"
    name="generatePassword"
    checked={formData.generatePassword}
    onChange={(e) => {
      const checked = e.target.checked;
      if (checked) {
        // Generate password and set it in state
        const newPass = generatePass();
        setFormData({
          ...formData,
          generatePassword: true,
          password: newPass,
          cpassword: newPass
        });
      } else {
        // Uncheck: reset passwords
        setFormData({
          ...formData,
          generatePassword: false,
          password: "",
          cpassword: ""
        });
      }
    }}
    disabled={!emailVerified} 
    className="mr-2"
  />
  Generate password for me
</label>


        {/* Password */}
        <label className="block mb-2 font-medium">
          Password<span className="text-red-500">*</span>
        </label>
         <div className="relative mb-4">
        <input
          type={showPass?"text":"password"}
          name="password"
          minLength="8"
          maxLength="16"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#%&*]).*$"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required={!formData.generatePassword}
          disabled={formData.generatePassword||!emailVerified} // Only enabled after email verification
        />

<p className="text-green-600 text-sm mt-1">
  Password must contain atleast 1 uppercase, 1 lowercase, 1 special character and min. length = 8
</p>
              <button
            type="button"
            className="absolute right-2 top-2 text-gray-600"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? "🙈" : "👁️"}
          </button>
</div>
        {/* Confirm Password */}
        <label className="block mb-2 font-medium">
          Confirm Password<span className="text-red-500">*</span>
        </label>
        <div className="relative mb-4">
        <input
          type={showCPass?"text":"password"}
          name="cpassword"
          placeholder="Retype your password"
          value={formData.cpassword}
          onChange={handleChange}
          className="w-full mb-6 p-2 border border-gray-300 rounded"
          required={!formData.generatePassword}
          disabled={formData.generatePassword||!emailVerified}
        />
         <button
            type="button"
            className="absolute right-2 top-2 text-gray-600"
            onClick={() => setShowCPass(!showCPass)}
          >
            {showCPass ? "🙈" : "👁️"}
          </button>
</div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition"
        >
          Sign Up
        </button>
        <p className="text-center text-gray-700 mt-6 text-base sm:text-sm md:text-base lg:text-lg">
  Already have an account?
  <a 
    href="/login" 
    className="text-blue-600 font-semibold ml-1 hover:text-blue-800 hover:underline transition-colors duration-200"
  >
    Login
  </a>
</p>

      </form>
    </div>}
    
    </>
  );
}
