import axiosInstance from "@/axiosInstance";
import { ServerResponse } from "@/types/global";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface DataType {
  name: string;
  index: number;
  value: number;
}

const DashBarChart: React.FC = () => {
  const [barData, setBarData] = useState<DataType[]>([
    { name: "Jan", index: 1, value: 0 },
    { name: "Feb", index: 2, value: 0 },
    { name: "Mar", index: 3, value: 0 },
    { name: "Apr", index: 4, value: 0 },
    { name: "May", index: 5, value: 0 },
    { name: "Jun", index: 6, value: 0 },
    { name: "Jul", index: 7, value: 0 },
    { name: "Aug", index: 8, value: 0 },
    { name: "Sep", index: 9, value: 0 },
    { name: "Oct", index: 10, value: 0 },
    { name: "Nov", index: 11, value: 0 },
    { name: "Dec", index: 12, value: 0 },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get<
          ServerResponse & { plantByMonth: { month: number; count: number }[] }
        >("/plant/getPlantByMonth");

        if (res.data.status === "ok") {
          res.data.plantByMonth.forEach(({ month, count }) => {
            setBarData((prevMonths) =>
              prevMonths.map((m) =>
                m.index === month ? { ...m, value: count } : m
              )
            );
          });
        }
      } catch (error) {}
    })();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={barData} className="">
        <XAxis dataKey="name" />
        <YAxis />

        <Bar dataKey="value" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DashBarChart;
