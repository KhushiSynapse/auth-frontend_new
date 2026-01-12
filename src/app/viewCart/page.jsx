"use client"

import React,{useEffect,useState} from "react"
import {useRouter} from "next/navigation"
export default function viewCart(){
    const[list,setList]=useState([])
    
    const router=useRouter()
    useEffect(()=>{
        const getCartItem=async()=>{
            try{
                const token=localStorage.getItem("token")
                const response=await fetch("https://auth-backend-c94t.onrender.com/api/auth/list-items",
                    {
                        method:"GET",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":`Bearer ${token}`,
                        }
                    }
                )

               
                if(response.ok){
                const data=await response.json()
                setList(data)
                
            }else if(response.status===401){
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        }
        else{
            const data=await response.json()
            if(list.length===0){
                    router.push("/landing")
            alert(data.message)}
        }}catch(error){
            alert(error.message)
        }
        }
        getCartItem()

    },[])
    const updateQuantity=async(id,newQuantity)=>{
      try{
                const token=localStorage.getItem("token")
                const response=await fetch(`https://auth-backend-c94t.onrender.com/api/auth/update-quantity/${id}`,{
                    method:"PATCH",
                    headers:{"Content-Type":"application/json",
                        "Authorization":`Bearer ${token}`
                    },
                    body:JSON.stringify({Quantity:newQuantity})
                })
                if(response.ok){
                    setList(prev =>
        prev.map(item =>
          item._id === id ? { ...item, Quantity: newQuantity } : item
        )
      );
                }
                else{
                  const data=await response.json()

                    alert(data.message)  
                }
            }
            catch(error){
                alert(error.message)
            }
    }
    const removeItem=async(id)=>{
            try{
                const token=localStorage.getItem("token")
                const response=await fetch(`https://auth-backend-c94t.onrender.com/api/auth/remove-item/${id}`,{
                    method:"DELETE",
                    headers:{"Content-Type":"application/json",
                        "Authorization":`Bearer ${token}`
                    }
                })
                if(response.ok){
                    const data=await response.json()
                    setList(list.filter((item)=>item._id!==id))
                    if(list.length===0){
                        router.push("/landing")
                    }
                    alert(data.message)
                }
                else{
                  const data=await response.json()

                    alert(data.message)  
                }
            }
            catch(error){
                alert(error.message)
            }
    }

         const incQuantity=(id,currentQuantity)=>{
            const newQuantity = currentQuantity + 1;
  updateQuantity(id, newQuantity);
            
         }
           const MIN_Quantity=1
          const decQuantity=(id,currentQuantity)=>{
            const newQuantity = Math.max(currentQuantity - 1, MIN_Quantity);
  updateQuantity(id, newQuantity);
         }
    const totalPrice= list.reduce((sum, product) => sum + (Number(product.price)*product.Quantity), 0)
    
    return(
        <>
         <div className="min-h-screen bg-gray-100 py-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Cart Items
      </h2>

      <div className="max-w-5xl mx-auto space-y-6">
        {list.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-lg flex flex-col md:flex-row items-center md:items-start p-6 space-y-4 md:space-y-0 md:space-x-6"
          >
            {/* Product Image */}
            <img
              src={product.imageURL[0]}
              alt={product.name}
              className="w-full md:w-40 h-40 object-cover rounded-lg"
            />

            {/* Product Details */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-gray-600 mt-1">
                Quantity:{product.Quantity}
              </p>
             
              <p className="text-gray-600 mt-1">
                Price: ${product.price}
              </p>
              <div className="flex items-center gap-4 mt-3">
  <button
    onClick={() => decQuantity(product._id,product.Quantity)}
    className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
  >
    −
  </button>

  <span className="px-4 py-1 border rounded-md font-semibold text-gray-800">
    {product.Quantity}
  </span>

  <button
    onClick={() => incQuantity(product._id,product.Quantity)}
    className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
  >
    +
  </button>
</div>


              {/* Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  View Product
                </button>
                <button onClick={()=>removeItem(product._id)}className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
       {list.length > 0 && (
  <div className="flex justify-center">
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
      <p className="text-lg font-semibold">
        Total Items: {list.length}
      </p>
      <p className="text-lg font-semibold mt-2">
        Total Price: ${totalPrice}
      </p>
      <button onClick={()=>router.push("/checkout")}className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
        Pay
      </button>
    </div>
  </div>
)}

      </div>
    </div>
        </>
    )
}