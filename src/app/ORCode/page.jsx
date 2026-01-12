import React from "react";
import Image from "next/image";
import Link from"next/link"
export default function QR({ image }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 max-w-md w-full text-center">
        
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
          Scan this code using an authenticator app
        </h2>

        <div className="flex justify-center">
          <Image
            src={image}
            alt="QR Code"
            width={300}
            height={300}
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
          />
        </div>
       <button ><Link href="/login" className="
        inline-block
        px-6
        py-3
        text-white
        bg-blue-600
        hover:bg-blue-700
        focus:ring-4
        focus:ring-blue-300
        rounded-lg
        text-center
        font-medium
        transition
        duration-200
        ease-in-out
        w-full
        sm:w-auto
      ">Go to Login</Link></button>
      </div>
    </div>
  );
}
