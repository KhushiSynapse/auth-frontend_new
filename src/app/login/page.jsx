
"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation"
export default function Login() {
  const router=useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    
  });
  const [showPass, setShowPass] = useState(false);
  const[showtotp,setShowTotp]=useState(false)
  const[otp,setOtp]=useState("")
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
   const handleSubmit=async(e)=>{
       e.preventDefault()
        
       try{
        const response=await fetch("https://auth-backend-c94t.onrender.com/api/auth/login-userr",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({email:formData.email,password:formData.password})
        })
        if(response.ok){
         
          alert("Login Successfull")
          setShowTotp(true)
        }
        else{
          alert("Wrong credentials")
        }
       }
       catch(error){
        alert(error.message)
       }
   }

   const handleVerifyOtp=async()=>{
    try{
      const response=await fetch("https://auth-backend-c94t.onrender.com/api/auth/verify-userotp",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({otp,email:formData.email})
      })
     const data=await response.json()
      if(response.ok){
         
          localStorage.setItem("token",data.token)
          
         router.push("/landing")
      }
      
      else{
          alert("Wrong OTP")
      }
    }
    catch(error){
      alert(error.message)
    }
   }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
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
              
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">
              Password <span className="text-red-500">*</span>
            </label>
             <div className="relative mb-4">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-gray-600"
              onClick={() => setShowPass(!showPass)

              }
            >
              {showPass ? "🙈" : "👁️"}
            </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>
           {showtotp && (
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
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
          </div>)}
        </form>

        {/* Footer text */}
        <p className="text-center text-gray-600 mt-4 text-sm sm:text-base">
        New User?
          <a
            href="/"
            className="text-blue-600 ml-1 font-semibold hover:text-blue-800 hover:underline transition-colors duration-200"
          >
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
}
