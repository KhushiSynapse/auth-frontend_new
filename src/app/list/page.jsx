"use client"

import React, { useEffect, useState } from "react";
import {useRouter} from "next/navigation"
import {useLang} from "../../context/LanguageContext"

export default function List() {
  const [users, setList] = useState([]);
  const[loading,setLoading]=useState(true)
  const[loaded,setLoaded]=useState(false)
  const{t,lang}=useLang()
const router=useRouter()
  useEffect(() => {
    const listUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://auth-backend-c94t.onrender.com/api/auth/list-users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "Accept-Language":lang
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setList(data);
          setLoaded(true)
        }else if(response.status===401){
          alert("Token expired")
          localStorage.removeItem("token")
          router.push("/login")
        }
        else{
            const data = await response.json();
            alert(data.message)
            router.push("/landing")
        }
      } catch (error) {
        alert(error.message);
        
      }
      finally{
        setLoading(false)
      }
      
    };
    listUsers();
  }, []);
  

if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">{t.Loading}...</p>
      </div>
    );
  }

  return (
    <>
  {loaded &&  <div className="flex justify-center items-start min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">{t.All} {t.User}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md mx-auto">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-2 px-4 text-left">{t.FirstName}</th>
                <th className="py-2 px-4 text-left">{t.LastName}</th>
                <th className="py-2 px-4 text-left">{t.Role}</th>
                <th className="py-2 px-4 text-left">{t.Email}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                  <tr
                    key={user.id || index}
                    className="even:bg-gray-100 odd:bg-white hover:bg-gray-200 transition"
                  >
                    <td className="py-2 px-4">{user.firstname}</td>
                    <td className="py-2 px-4">{user.lastname}</td>
                    <td className="py-2 px-4">{user.role.name}</td>
                    <td className="py-2 px-4 break-all">{user.email}</td>
                  </tr>
                ))
             
              }
            </tbody>
          </table>
        </div>
      </div>
    </div> }
    </>
  );
}
