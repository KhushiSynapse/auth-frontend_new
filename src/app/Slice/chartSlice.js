import {createSlice} from "@reduxjs/toolkit"

const initialState={
    ordersPerDay:[],
    amountperDay:[],
    orderDistribution:[]
}

const ChartSlice=createSlice({
        name:"chart",
        initialState,
        reducers:{
            setOrdersPerDay:(state,action)=>{
                state.ordersPerDay=action.payload
            },
            addOrderToChart:(state,action)=>{
                const newOrder=action.payload
                const date=String(new Date(newOrder.date))
                const existing=state.ordersPerDay.find(d=>d.date===date)
                if(existing){
                    existing.total+=1
                }
                else{
                    state.ordersPerDay.push({date,total:1})
                     state.ordersPerDay.sort((a, b) => new Date(a.date) - new Date(b.date));
                }
            },setRevenuePerDay:(state,action)=>{
                state.amountperDay=action.payload
            },
            setOrderDistribution:(state,action)=>{
                state.orderDistribution=action.payload
            }
        }
})

export const {setOrdersPerDay,addOrderToChart,setRevenuePerDay,setOrderDistribution}=ChartSlice.actions
export default ChartSlice.reducer