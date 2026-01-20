"use client";

import React from "react";
import {PieChart,Pie, Cell, ResponsiveContainer, Tooltip,Legend,} from "recharts";

import { useSelector } from "react-redux";
const COLORS = ["#22c55e", "#ef4444"]; // processed, cancelled

export default function Modal({ open, onClose, date }) {
  if (!open) return null;
  const data=useSelector(state=>state.chart.orderDistribution||[])
  const PieDataRaw=data.find(d=>d.date===date)
  const PieData = [
  { name: "Processed", value: PieDataRaw.processed },
  { name: "Cancelled", value: PieDataRaw.cancelled },
];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal Box */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        {/* Close Button */}
      <button
  onClick={(e) => {
    e.stopPropagation();
    onClose();
  }}
  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
>
  ×
</button>


        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-4">
          Order Status {date && `(${date})`}
        </h2>

        {/* Pie Chart */}
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={PieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                label
              >
                {PieData?.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
