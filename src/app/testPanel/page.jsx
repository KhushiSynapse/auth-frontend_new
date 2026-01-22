"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLang } from "../../context/LanguageContext";

import { useGetOrderListQuery,orderApi } from "../orderlog/orderApi";
import { socket } from "../socket/page";
import { ListUsersApi ,useGetUserListQuery} from "../list/ListUsersApi";
import { useDispatch,useSelector } from "react-redux";
import Modal from "../adminpanel/Modal";
import {setOrdersPerDay, addOrderToChart, setRevenuePerDay,setOrderDistribution} from "../Slice/chartSlice"
import {  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const { t, setLang, dir, lang } = useLang();
 const dispatch=useDispatch()
 const [stat,setStat]=useState({})
 const chartData=useSelector(state=>state.chart.ordersPerDay||[])
 console.log(chartData)
  const {data:orders=[],isLoading,error}=useGetOrderListQuery()
  const{data:list=[],load}=useGetUserListQuery()
  const[daysToShow,setDaysToShow]=useState(7)  
  const [toggle,setToggle]=useState(true)
   const orderStatusData=useSelector(state=>state.chart.orderDistribution)
  const revenueData=useSelector(state=>state.chart.amountperDay||[])
  const [selectedDate, setSelectedDate] = useState(null);
  const date=new Date().toISOString().split("T")[0]
  const totalorder = chartData.find(item=>item.date===date)?.total||0;
  useEffect(()=>{
    const getStats=async()=>{
      const response=await fetch("https://auth-backend-c94t.onrender.com/api/auth/get-stats",{
        method:"GET"
      })
      const data=await response.json()
      if(response.ok){
       setStat(data)
      }
    }
    getStats()
  },[])
  const totalRevenue = React.useMemo(() => {
  return orders.reduce((sum, order) => {
    if (
      order.createdat.split("T")[0] === date &&
      order.orderstatus !== "cancelled"
    ) {
      return sum + Number(order.amount || 0);
    }
    return sum;
  }, 0);
}, [orders, date]);

  const filteredOrderData=chartData.slice(-daysToShow)
   const filteredRevenueData=revenueData.slice(-daysToShow)
   const filteredStatusData=orderStatusData.slice(-daysToShow)
const totalUsers = list.length 
const [isOpen,setisOpen]=useState(false)
 const totalCancelledPayments = React.useMemo(() => {
  return orders.reduce((count, order) => {
    // Check if the order date matches
    if (order.createdat.split("T")[0] === date && order.orderstatus === "cancelled") {
      return count + 1;
    }
    return count;
  }, 0); 
}, [orders, date]);

  
  console.log(totalCancelledPayments)
  console.log(totalUsers)
  const [collapsedMenus, setCollapsedMenus] = useState({
    userManagement: false,
    orders: false,
    profileSettings: false,
  });

  useEffect(()=>{
 if(orders.length>0){
    const OrderWithDate=orders.map((order)=>{
      const date=new Date(order.createdat)
      const formattedDate=date.toISOString().split("T")[0]
      return {...order,formattedDate}
    })

    const TotalOrdersDatewise=OrderWithDate.reduce((total,order)=>{
      if(!total[order.formattedDate]) total[order.formattedDate]=0
      total[order.formattedDate] +=1
      return total},{})

      const OrderStatusWise=OrderWithDate.reduce((dist,order)=>{
        const date=order.formattedDate
     if(!dist[date]){
      dist[date]={date,cancelled:0,processed:0}
     }
        if(order.orderstatus==="cancelled") dist[date].cancelled+=1
        else
          dist[date].processed+=1
        return dist
      },{})

       const statusDatewise = Object.entries(OrderStatusWise).map(
  ([date, value]) => ({
    date,
    cancelled: value.cancelled,
    processed: value.processed
  })
);

      const totalAmountDateWise = OrderWithDate.reduce((totalAmount, order) => {
        if(order.orderstatus==="cancelled") return totalAmount
  const date = order.formattedDate; // use the same date as for orders
  if (!totalAmount[date]) totalAmount[date] = 0;
  totalAmount[date] += Number(order.amount || 0); // add the amount
  return totalAmount;
}, {});

   const amountchart=Object.entries(totalAmountDateWise).map(([date,totalAmount])=>({
    date,
    totalAmount
   }))
  const chartData=Object.entries(TotalOrdersDatewise).map(([date,total])=>({
    date,
    total
  }))
  
 const limitedOrder= chartData.sort((a,b)=>new Date(b.date)-new Date(a.date)).reverse()
  const limitedAmount=amountchart.sort((a,b)=>new Date(b.date)-new Date(a.date)).reverse()
  
  dispatch(setOrdersPerDay(limitedOrder))
 dispatch(setRevenuePerDay(limitedAmount))
dispatch(setOrderDistribution(statusDatewise))}
}
 
,[dispatch,orders])

    useEffect(()=>{
    socket.connect()
    const NewData=(newOrder)=>{
      dispatch(
        orderApi.util.updateQueryData('getOrderList',undefined,(draft)=>{
            draft.push(newOrder)}))
          const newDate=new Date(newOrder.createdat).toISOString().split("T")[0]
        dispatch(addOrderToChart({date:newDate,total:1}))}
            
            
            
    socket.on("order:generated",NewData)
   
    const handleCancelOrder=({orderId})=>{
      dispatch(
        orderApi.util.updateQueryData('getOrderList',undefined,(draft)=>{
          const order=draft.find((o)=>o._id===orderId)
          if(order){
            order.orderstatus="cancelled"
          }
        })
      )
    }
  socket.on("order:cancelled",handleCancelOrder)

  const NewUser=({userdata})=>{
    dispatch(ListUsersApi.util.updateQueryData('getUserList',undefined,(draft)=>{
      draft.push(userdata)
    }))
  }
  socket.on("user:created",NewUser)
   return () => {
  socket.off("order:generated", NewData);
  socket.off("order:cancelled",handleCancelOrder)
  socket.off("user:created",NewUser)
};

},[dispatch])
  if (!lang) return null;

  const handleBarClick=(date)=>{
    setisOpen(true)
    setSelectedDate(date)
  }
    
  const handleLogout = () => {
    localStorage.removeItem("token");
    setLang("en");
    localStorage.setItem("lang", "en");
    router.push("/login");
  };

  const toggleMenu = (menu) => {
    setCollapsedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Stats card data without icons
  const statCards = [
    {
      title: "Total Orders Today",
      value: stat.totalOrders,
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Total Revenue Today",
      value: "$"+ stat.totalRevenue,
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Total Users",
      value: totalUsers,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Total Cancelled Payment",
      value: stat.cancelledPayments,
      color: "bg-red-100 text-red-800",
    },
  ];
 if((isLoading || load)) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h2 className="text-xl md:text-2xl font-semibold text-blue-600 animate-pulse">
        Loading.....
      </h2>
    </div>
  );
  
  return (
    
    <div dir={dir} className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="text-2xl font-bold p-4 border-b">{t.MyApp}</div>
        <nav className="flex-1 overflow-y-auto">
          {/* User Management */}
          <div>
            <button
              onClick={() => toggleMenu("userManagement")}
              className="w-full text-left p-3 hover:bg-gray-100 flex justify-between items-center font-medium"
            >
              User Management
              <span>{collapsedMenus.userManagement ? "▲" : "▼"}</span>
            </button>
            {collapsedMenus.userManagement && (
              <div className="pl-4">
                <Link href="/create" className="block p-2 hover:bg-gray-50 rounded">
                  {t.CreateProfile}
                </Link>
                <Link href="/delete" className="block p-2 hover:bg-gray-50 rounded">
                  {t.DeleteProfile}
                </Link>
                <Link href="/list" className="block p-2 hover:bg-gray-50 rounded">
                  {t.ListUsers}
                </Link>
              </div>
            )}
          </div>
{console.log("Pay"+stat.cancelledPayments)}
          {/* Orders / Transactions */}
          <div>
            <button
              onClick={() => toggleMenu("orders")}
              className="w-full text-left p-3 hover:bg-gray-100 flex justify-between items-center font-medium"
            >
              Orders & Transactions
              <span>{collapsedMenus.orders ? "▲" : "▼"}</span>
            </button>
            {collapsedMenus.orders && (
              <div className="pl-4">
                <Link href="/orderlog" className="block p-2 hover:bg-gray-50 rounded">
                  View Order Log
                </Link>
                <Link href="/approveRefund" className="block p-2 hover:bg-gray-50 rounded">
                  Approve Refund
                </Link>
                <Link href="/assign" className="block p-2 hover:bg-gray-50 rounded">
                  Assign Roles
                </Link>
              </div>
            )}
          </div>

          {/* Profile / Password */}
          <div>
            <button
              onClick={() => toggleMenu("profileSettings")}
              className="w-full text-left p-3 hover:bg-gray-100 flex justify-between items-center font-medium"
            >
              Profile & Settings
              <span>{collapsedMenus.profileSettings ? "▲" : "▼"}</span>
            </button>
            {collapsedMenus.profileSettings && (
              <div className="pl-4">
                <Link href="profile" className="block p-2 hover:bg-gray-50 rounded">
                  {t.ViewProfile}
                </Link>
                <Link href="/password" className="block p-2 hover:bg-gray-50 rounded">
                  {t.ChangePassword}
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full p-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            {t.Logout}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="px-3 py-1 rounded bg-blue-500 text-white"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="ar">Arabic</option>
            <option value="sp">Spanish</option>
          </select>
        </header>

        {/* Stats Cards */}
        <main className="p-6 bg-gray-50 flex-1">
          {isOpen && (
    <Modal
      open={isOpen}
      date={selectedDate}
      onClose={() => setisOpen(false)}
    />
  )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
  {statCards.map((card, idx) => (
    <div
      key={idx}
      className={`p-6 rounded-lg shadow-2xl ${card.color} hover:shadow-xl transition duration-300 transform hover:scale-105`}
    >
      <h3 className="text-md font-semibold">{card.title}</h3>
      <p className="text-2xl font-bold mt-2">{card.value}</p>
    </div>
  ))}
</div>

      {/* Chart Section */}
<div className="mt-8">
  {/* Filter Buttons above charts */}
  <div className="flex justify-center gap-4 mb-6">
    <button
      onClick={() => setDaysToShow(3)}
      className={`px-5 py-2 font-semibold rounded-lg shadow transition-colors duration-200 
        ${daysToShow === 3 ? "bg-blue-600 text-white" : "bg-blue-200 text-blue-800 hover:bg-blue-300"}`}
    >
      Last 3 Days
    </button>

    <button
      onClick={() => setDaysToShow(5)}
      className={`px-5 py-2 font-semibold rounded-lg shadow transition-colors duration-200 
        ${daysToShow === 5 ? "bg-green-600 text-white" : "bg-green-200 text-green-800 hover:bg-green-300"}`}
    >
      Last 5 Days
    </button>

    <button
      onClick={() => setDaysToShow(7)}
      className={`px-5 py-2 font-semibold rounded-lg shadow transition-colors duration-200 
        ${daysToShow === 7 ? "bg-gray-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
    >
      Last 7 Days
    </button>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Orders Per Day / Status Chart Card */}
  <div className="p-6 bg-gradient-to-br from-blue-200 to-blue-200 rounded-xl shadow-lg relative">
    {/* Card Header */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-blue-700">
       {toggle? ("Orders Per Day"):("Order Status Per Day")}
      </h2>
      {/* Toggle Button */}
      <button
        onClick={() => setToggle(!toggle)}
        className="px-3 py-1 bg-white text-blue-700 font-semibold rounded-lg shadow hover:bg-blue-50 transition"
      >
        {toggle ? "Show Status" : "Show Total"}
      </button>
    </div>

    {/* Chart */}
    <div className="w-full">
      {toggle ? (
        <BarChart
          width={500}
          height={280}
          data={filteredOrderData}
          onClick={(chartEvent) => {
            if (chartEvent && chartEvent.activeLabel) {
              handleBarClick(chartEvent.activeLabel);
            }
          }}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#cbd5e1" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#1e40af" }} />
          <YAxis tick={{ fontSize: 12, fill: "#1e40af" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#e0f2fe", borderRadius: "8px" }}
            itemStyle={{ color: "#1e40af" }}
          />
          <Legend wrapperStyle={{ fontSize: 14, color: "#1e40af" }} />
          <Bar dataKey="total" fill="#1e40af" radius={[6, 6, 0, 0]} />
        </BarChart>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={filteredStatusData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#1e40af" }} />
            <YAxis tick={{ fontSize: 12, fill: "#1e40af" }} />
            <Tooltip />
            <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 14 }} />
            <Bar dataKey="processed" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="cancelled" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  </div>

  {/* Revenue Per Day Chart Card */}
  <div className="p-6 bg-gradient-to-br from-green-200 to-green-200 rounded-xl shadow-lg">
    <h2 className="text-xl font-bold mb-4 text-green-700">Revenue Per Day</h2>
    <div className="w-full">
      <BarChart
        width={500}
        height={280}
        data={filteredRevenueData}
        margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="4 4" stroke="#bbf7d0" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#047857" }} />
        <YAxis tick={{ fontSize: 12, fill: "#047857" }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#dcfce7", borderRadius: "8px" }}
          itemStyle={{ color: "#047857" }}
        />
        <Legend wrapperStyle={{ fontSize: 14, color: "#047857" }} />
        <Bar dataKey="totalAmount" fill="#047857" radius={[6, 6, 0, 0]} />
      </BarChart>
    </div>
  </div>
</div>
</div>

        </main>
      </div>
    </div>
  );
}
