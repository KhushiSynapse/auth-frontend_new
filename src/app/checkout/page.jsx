"use client";

import React, { useEffect, useState } from "react";
import {useLang} from "../../context/LanguageContext"
import{useRouter} from "next/navigation"

export default function Checkout() {
  const [list, setList] = useState([]);
  const[data,setData]=useState({})
  const{t,lang}=useLang()
  const [sdkReady, setSdkReady] = useState(false)
 const router=useRouter()

  useEffect(() => {
    const getSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const response1 = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/list-items",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

           const response2=await fetch("https://auth-backend-c94t.onrender.com/api/auth/view-profile",{
            method:"GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "Accept-Language":lang
          },
           })
    if(response2.ok){
        const data=await response2.json()
 setData(data)

    }else if(response2.status===401){
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        }
        const data = await response1.json();

        if (response1.ok) {
          setList(data);
          console.log(list.length)
        } else {
          alert(data.message);
        }
      } catch (error) {
        alert(error.message);
      }
    };

    getSummary();
  }, []);
const totalPrice = list.reduce(
    (sum, product) => sum + Number(product.price) * product.Quantity,
    0
  );

  useEffect(()=>{
   
  const script=document.createElement("script")
  script.src="https://www.paypal.com/sdk/js?client-id=AfDJwsOo_l1yeDzJqBK5I75qPeUUlQpXo7LP3rw42hFHjSnSlTPKHK95XnuxcYXQVFrVVDr0KrtAxwkj&currency=USD"
  script.async = true;
    script.onload = () => setSdkReady(true);
    document.body.appendChild(script);
    
},[])


 useEffect(() => {
    if (sdkReady && list.length>0) {
      const token = localStorage.getItem("token");

      // 2️⃣ Initialize PayPal Buttons
      window.paypal.Buttons({
        env:"sandbox",
        createOrder: async (data, actions) => {
          try {
             const totalPrice = list.reduce((sum, product) => sum + Number(product.price) * Number(product.Quantity), 0);
            const response = await fetch(
              "https://auth-backend-c94t.onrender.com/api/auth/create-order",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
               
                body: JSON.stringify({ amount: totalPrice.toFixed(2)}),
              }
            );

            const dataJson = await response.json();
            return dataJson.orderId; 
          } catch (err) {
            console.error("Error creating order:", err);
          }
        },
        onApprove: async (data, actions) => {
  try {
    // Capture PayPal order
    const response = await fetch(
      "https://auth-backend-c94t.onrender.com/api/auth/capture-order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: data.orderID }),
      }
    );
    const captureData = await response.json();
    console.log("Payment Captured:", captureData);

    const capture = captureData?.details?.purchase_units?.[0]?.payments?.captures?.[0];
    console.log("capture", capture);

    const amount = capture.amount?.value;
    const currency = capture.amount?.currency_code;
    const paymentStatus = capture.status;
    const captureId = capture?.id;
    const paymentPaidAt = new Date(capture?.create_time);
    const paymentMethod = Object.keys(captureData?.details?.payment_source || {})[0] || "UNKNOWN";

    // Create order in DB
    let oid;
    try {
      const response2 = await fetch(
        "https://auth-backend-c94t.onrender.com/api/auth/create-orderinDB",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount, currency, paymentStatus, captureId }),
        }
      );
      const result = await response2.json();
      if (response2.ok) {
         oid = result._id;
        console.log(oid);
       
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }

    // Create transaction
    try {
      await fetch("https://auth-backend-c94t.onrender.com/api/auth/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          currency,
          paymentStatus,
          captureId,
          paymentPaidAt,
          paypalorderId: data.orderID,
          paymentMethod,
          orderid: oid,
        }),
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
    }

    // Add order items
    try {
      await fetch("https://auth-backend-c94t.onrender.com/api/auth/add-orderitems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ list, id: oid }),
      });
    } catch (error) {
      console.error("Error adding order items:", error);
    }

    // Clear cart
    try {
      await fetch("https://auth-backend-c94t.onrender.com/api/auth/clear-cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }

    // Redirect
    router.push(`/final?orderid=${data.orderID}&amount=${amount}`);
  } catch (err) {
    console.error("Error capturing order:", err);
    alert("Something went wrong during payment processing.");
  }
},

        onCancel:(data)=>{
          console.warn("Payment cancelled by user:", data)
          alert("Payment cancelled")
        },
        onError:(err)=>{
          console.error("PayPal SDK error:", err)
          alert("Something went wrong with PayPal. Please try again.")
        }
      }).render("#paypal-button");
    }
  }, [sdkReady,totalPrice]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-6 relative">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4">
          Order Summary
        </h2>

        {/* User Details - Top Left */}
        <div className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/3 text-gray-700 mb-6">
          <p className="font-semibold text-lg">{data.firstname} {data.lastname}</p>
          <p className="text-base mt-1">
            21, MG Road, Pune, Maharashtra - 411001
          </p>
          <p className="text-base mt-1">Email: {data.email}</p>
        </div>
      </div>

      {/* Product List */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
  {/* Table Header */}
  <div className="hidden md:grid grid-cols-4 gap-4 border-b p-4 font-semibold text-gray-600">
    <p>Product Name</p>
    <p className="text-center">Price</p>
    <p className="text-center">Quantity</p>
    <p className="text-right">Total Price</p>
  </div>

  {/* Products */}
  {list.map((product, index) => (
    <div
      key={index}
      className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 border-b p-4 text-gray-700 items-center"
    >
      <p className="font-medium">{product.name}</p>
      <p className="text-center">₹{product.price}</p>
      <p className="text-center">{product.Quantity}</p>
      <p className="text-right">
        ₹{Number(product.Quantity) * Number(product.price)}
      </p>
    </div>
  ))}
</div>


      {/* Total Section */}
      <div className="max-w-4xl mx-auto mt-8 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          Total Items: {list.length}
        </h3>
        <h3 className="text-xl font-bold text-gray-900">
          Total Price: ₹{totalPrice}
        </h3>

       
       <div id="paypal-button" className="w-full max-w-sm mt-4 p-4 bg-white rounded-lg shadow-md flex justify-center"></div>
      </div>
    </div>
  );
}
