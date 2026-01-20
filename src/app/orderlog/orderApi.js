"use client"
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const orderApi=createApi({
    reducerPath:"orderapi",
    baseQuery:fetchBaseQuery({
        baseUrl:"https://auth-backend-c94t.onrender.com/api/auth"
    }),
    endpoints:(builder)=>({
        getOrderList:builder.query({
            query:()=>({
                url:'/get-AllOrders',
                method:"GET",
                
            })
        })
    })
}) 

export const {useGetOrderListQuery}=orderApi