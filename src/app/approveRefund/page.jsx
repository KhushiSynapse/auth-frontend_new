"use client"

import React, { useEffect, useState } from "react";
import {useRouter} from "next/navigation"

export default function ApproveRefund() {
  const [list, setList] = useState([]);
  const [loading,setLoading]=useState(true)
  const router=useRouter()
  useEffect(() => {
    const token = localStorage.getItem("token");

    const getList = async () => {
      try {
        const response = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/get-RefundList",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setList(data);
          setLoading(false)
        } else {
          alert(data.message);
          router.push("/landing")
        }
      } catch (error) {
        alert(error.message);
      }
    };

    getList();
  }, []);

  const handleApprove = async (id,uid) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://auth-backend-c94t.onrender.com/api/auth/get-refund/${id}/${uid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Refund successful");
        // Optional: remove refunded order from list
        setList((prev) => prev.filter((order) => order._id !== id));
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };
{if(loading) return(<h1>Loading....</h1>)}
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
        Refund Requests
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.length > 0 ? (
          list.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between"
            >
              <div>
                <p className="text-gray-700 font-medium">
                  User ID: <span className="font-normal">{order.userid}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Amount: <span className="font-normal">{order.amount}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Order Status: <span className="font-normal">{order.orderstatus}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  Payment Status: <span className="font-normal">{order.paymentstatus}</span>
                </p>
              </div>
              <button
                onClick={() => handleApprove(order._id,order.userid)}
                className="mt-4 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Approve Refund
              </button>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No refund requests
          </p>
        )}
      </div>
    </div>
  );
}
