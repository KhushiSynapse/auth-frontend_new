"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ListUsersApi = createApi({
  reducerPath: "listapi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://auth-backend-c94t.onrender.com/api/auth",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  keepUnusedDataFor:3600,
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: () => ({
        url: "/list-users",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserListQuery } = ListUsersApi;

