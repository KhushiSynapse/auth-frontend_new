
"use client"
import React, { useState,useEffect } from "react";
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
  const [coolDown,setcoolDown]=useState(0)
  const [clicked,setClicked]=useState(false)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
   const handleSubmit=async(e)=>{
       e.preventDefault()
       if(coolDown>0) return
        setClicked(true)
       try{
        const response=await fetch("https://auth-backend-c94t.onrender.com/api/auth/login-userr",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({email:formData.email,password:formData.password})
        })
        if(response.ok){
         
          alert("Login Successfull")
          setShowTotp(true)
        }else if(response.status===429){
          const data=await response.json()
          const expiryTime = Date.now() + data.retryAfter * 1000;
  localStorage.setItem("loginCooldown", expiryTime);
      setcoolDown(data.retryAfter);
      setClicked(false)
      alert(data.message)
        }
        else{
           setClicked(false)
          alert("Wrong credentials")
         
        }
       }
       catch(error){
        alert(error.message)
        setClicked(false)
       }
   }
   useEffect(() => {
  const expiryTime = Number(localStorage.getItem("loginCooldown"));
  if (!expiryTime) return;

  const remaining = Math.floor((expiryTime - Date.now()) / 1000);

  if (remaining > 0) {
    setcoolDown(remaining);

    const timer = setInterval(() => {
      setcoolDown((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          localStorage.removeItem("loginCooldown");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // cleanup on unmount
  } else {
    localStorage.removeItem("loginCooldown");
  }
}, [coolDown]);


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
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl border-l-4 border-blue-500 hover:shadow-blue-400 transition-shadow duration-300">

        <h3 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-6">
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
  disabled={clicked || showtotp || coolDown > 0}
  className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-lg 
hover:scale-105 transform transition 
${clicked || showtotp || coolDown > 0 
  ? "opacity-70 cursor-not-allowed" 
  : "hover:bg-blue-700"}`}

>
  {showtotp ? (
    "Logged in"
  ) : coolDown > 0 ? (
    `Try again in ${Math.floor(coolDown / 60)}:${("0" + (coolDown % 60)).slice(-2)}`
  ) : clicked ? (
    <>
     <span className="inline-block w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>

      Logging in...
    </>
  ) : (
    "Login"
  )}
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
