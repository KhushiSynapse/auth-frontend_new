import {io} from "socket.io-client"

export const socket=io("https://auth-backend-c94t.onrender.com",{
    autoConnect:false
})