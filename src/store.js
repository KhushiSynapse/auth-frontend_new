import {configureStore} from "@reduxjs/toolkit"
import { orderApi } from "./app/orderlog/orderApi"
import chartReducer from "./app/Slice/chartSlice"
import { ListUsersApi } from "./app/list/ListUsersApi"
export  const store=configureStore({
    reducer:{
         [orderApi.reducerPath]: orderApi.reducer,
         chart:chartReducer,
         [ListUsersApi.reducerPath]:ListUsersApi.reducer

    },
     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(orderApi.middleware).concat(ListUsersApi.middleware),
})